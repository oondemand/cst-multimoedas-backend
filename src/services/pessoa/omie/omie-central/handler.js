const { mapImporter } = require("../mapImporter.js");

const ClienteService = require("../../../omie/clienteService.js");
const Pessoa = require("../../../../models/Pessoa/index.js");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { QueueService } = require("central-oon-core-backend");
const { processarIntegracao } = QueueService.defaultHandler;

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      const { appKey, appSecret } = await BaseOmie.findOne({ status: "ativo" });

      const clienteOmie = await ClienteService.consultar(
        appKey,
        appSecret,
        integracao.externalId
      );

      const pessoaFormatada = mapImporter({
        cliente: clienteOmie,
      });

      let pessoa = await Pessoa.findOneAndUpdate(
        { codigo_cliente_omie: pessoaFormatada.codigo_cliente_omie },
        { ...pessoaFormatada, status_sincronizacao_omie: "sucesso" }
      );

      if (!pessoa) {
        pessoa = await Pessoa.create({
          ...pessoaFormatada,
          status_sincronizacao_omie: "sucesso",
        });
      }

      integracao.payload = pessoa;
      integracao.parentId = pessoa._id;
      await integracao.save();

      return { message: "Cliente/prestador sincronizado com sucesso!" };
    },
  });
};

module.exports = {
  handler,
};
