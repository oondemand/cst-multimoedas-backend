const { excelToJson } = require("../../../utils/excel.js");
const { registrarAcao } = require("../../controleService.js");
const {
  ACOES,
  ENTIDADES,
  ORIGENS,
} = require("../../../constants/controleAlteracao.js");
const { mapImporter } = require("./mapImporter.js");
const { mapExporter } = require("./mapExporter");
const Servico = require("../../../models/Servico.js");
const Lista = require("../../../models/Lista.js");
const Pessoa = require("../../../models/Pessoa");
const PessoaService = require("../../pessoa");
const DocumentoFiscalService = require("../../documentoFiscal");
const DocumentoFiscal = require("../../../models/DocumentoFiscal.js");

const criarNovoDocumentoFiscal = async ({ documentoFiscal, usuario }) => {
  const novoDocumentoFiscal = new DocumentoFiscal(documentoFiscal);

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
    origem: ORIGENS.IMPORTACAO,
    dadosAtualizados: novoDocumentoFiscal,
    idRegistro: novoDocumentoFiscal._id,
    usuario: usuario,
  });

  await novoDocumentoFiscal.save();
  return novoDocumentoFiscal;
};

const criarNovaPessoa = async ({ pessoa, usuario }) => {
  const novaPessoa = new Pessoa(pessoa);

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.PESSOA,
    origem: ORIGENS.IMPORTACAO,
    dadosAtualizados: novaPessoa,
    idRegistro: novaPessoa._id,
    usuario: usuario,
  });

  await novaPessoa.save();
  return novaPessoa;
};

const buscarPessoaPorDocumento = async ({ documento }) => {
  if (!documento) return null;

  const pessoaExistente = await Pessoa.findOne({
    documento,
    status: { $ne: "arquivado" },
  });

  if (!pessoaExistente) return null;
  return pessoaExistente;
};

const processarJsonDocumentosFiscais = async ({ json, usuario }) => {
  const detalhes = {
    totalDeLinhasLidas: json.length - 1,
    linhasLidasComErro: 0,
    novosDocumentosFiscais: 0,
    errors: "",
  };

  const arquivoDeErro = [];

  for (const [i, row] of json.entries()) {
    try {
      if (i === 0) {
        arquivoDeErro.push(row);
        continue;
      }

      const documentoFiscalObj = await mapImporter({ row });

      let pessoa = await buscarPessoaPorDocumento({
        documento: documentoFiscalObj?.pessoa?.documento,
      });

      if (!pessoa) {
        pessoa = await criarNovaPessoa({
          pessoa: documentoFiscalObj.pessoa,
          usuario,
        });
      }

      await criarNovoDocumentoFiscal({
        documentoFiscal: { ...documentoFiscalObj, pessoa: pessoa._id },
        usuario,
      });

      detalhes.novosDocumentosFiscais += 1;
    } catch (error) {
      arquivoDeErro.push(row);
      detalhes.linhasLidasComErro += 1;
      detalhes.errors += `❌ [ERROR AO PROCESSAR LINHA]: ${
        i + 1
      }  - \nDETALHES DO ERRO: ${error}\n\n`;
    }
  }

  return { detalhes, arquivoDeErro };
};

const importar = async ({ arquivo, usuario }) => {
  const json = excelToJson({ arquivo });

  const { detalhes, arquivoDeErro } = await processarJsonDocumentosFiscais({
    json,
    usuario,
  });

  return { detalhes, arquivoDeErro };
};

const exportar = async ({ filtros, pageIndex, pageSize, searchTerm }) => {
  const { documentosFiscais } = await DocumentoFiscalService.listarComPaginacao(
    {
      filtros,
      pageIndex,
      pageSize,
      searchTerm,
    }
  );

  const json = documentosFiscais.map((documentoFiscal) => {
    const newRow = {};

    Object.entries(mapExporter()).forEach(([header, key]) => {
      const accessor = key?.split(".") || [];
      const value = accessor.reduce(
        (acc, curr) => acc?.[curr],
        documentoFiscal
      );
      newRow[header] = value ?? "";
    });

    return newRow;
  });

  return { json };
};

module.exports = { exportar, importar };
