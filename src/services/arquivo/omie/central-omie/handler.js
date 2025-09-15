const AnexoService = require("../../../omie/anexosService.js");
const ContaPagar = require("../../../../models/ContaPagar.js");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { QueueService } = require("central-oon-core-backend");
const { processarIntegracao } = QueueService.defaultHandler;
const {
  fileHandler: { compactFile },
} = require("central-oon-core-backend");
const Integracao = require("../../../../models/Integracao");

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      const { appKey, appSecret } = await BaseOmie.findOne({ status: "ativo" });
      const contaPagar = await ContaPagar.findById(integracao.parentId);

      const arquivoCompactado = await compactFile(
        integracao.payload.buffer?.buffer,
        integracao.payload.nomeOriginal
      );

      const param = {
        cCodIntAnexo: "",
        cTabela: "conta-pagar",
        nId: contaPagar.codigo_lancamento_omie,
        cNomeArquivo: integracao.payload.nomeOriginal,
        cArquivo: arquivoCompactado.base64File,
        cMd5: arquivoCompactado.md5,
      };

      integracao.requisicao = {
        url: `${process.env.API_OMIE}/geral/anexo/`,
        body: {
          call: "IncluirAnexo",
          app_key: appKey,
          app_secret: appSecret,
          param: [param],
        },
      };

      await integracao.save();

      const response = await AnexoService.incluir({
        appKey,
        appSecret,
        ...param,
      });

      return response;
    },
    onSuccess: async (integracao, resultado) => {
      const isAnexoPendente = await Integracao.findOne({
        parentId: integracao.parentId,
        tipo: "anexos",
        direcao: "central_omie",
        arquivado: false,
        etapa: { $nin: ["sucesso"] },
      });

      if (!isAnexoPendente) {
        await Integracao.findOneAndUpdate(
          {
            parentId: integracao.parentId,
            tipo: "conta_pagar",
            direcao: "central_omie",
            arquivado: false,
            etapa: { $nin: ["sucesso"] },
          },
          {
            etapa: "sucesso",
          }
        );
      }
    },
  });
};

module.exports = {
  handler,
};
