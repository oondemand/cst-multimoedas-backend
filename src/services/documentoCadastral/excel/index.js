const {
  excel: { excelToJson },
  registrarAcao,
} = require("central-oon-core-backend");
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
const DocumentoCadastralService = require("../../documentoCadastral");
const DocumentoCadastral = require("../../../models/DocumentoCadastral.js");

const criarNovoDocumentoCadastral = async ({ documentoCadastral, usuario }) => {
  const novoDocumentoCadastral = new DocumentoCadastral(documentoCadastral);

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
    origem: ORIGENS.IMPORTACAO,
    dadosAtualizados: novoDocumentoCadastral,
    idRegistro: novoDocumentoCadastral._id,
    usuario: usuario,
  });

  await novoDocumentoCadastral.save();
  return novoDocumentoCadastral;
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

const processarJsonDocumentosCadastrais = async ({ json, usuario }) => {
  const detalhes = {
    totalDeLinhasLidas: json.length - 1,
    linhasLidasComErro: 0,
    novosDocumentosCadastrais: 0,
    errors: "",
  };

  const arquivoDeErro = [];

  for (const [i, row] of json.entries()) {
    try {
      if (i === 0) {
        arquivoDeErro.push(row);
        continue;
      }

      const documentoCadastralObj = await mapImporter({ row });

      let pessoa = await buscarPessoaPorDocumento({
        documento: documentoCadastralObj?.pessoa?.documento,
      });

      if (!pessoa) {
        pessoa = await criarNovaPessoa({
          pessoa: documentoCadastralObj.pessoa,
          usuario,
        });
      }

      await criarNovoDocumentoCadastral({
        documentoCadastral: { ...documentoCadastralObj, pessoa: pessoa._id },
        usuario,
      });

      detalhes.novosDocumentosCadastrais += 1;
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

  const { detalhes, arquivoDeErro } = await processarJsonDocumentosCadastrais({
    json,
    usuario,
  });

  return { detalhes, arquivoDeErro };
};

const exportar = async ({ filtros, pageIndex, pageSize, searchTerm }) => {
  const { documentosCadastrais } =
    await DocumentoCadastralService.listarComPaginacao({
      filtros,
      pageIndex,
      pageSize,
      searchTerm,
    });

  const json = documentosCadastrais.map((documentoCadastral) => {
    const newRow = {};

    Object.entries(mapExporter()).forEach(([header, key]) => {
      const accessor = key?.split(".") || [];
      const value = accessor.reduce(
        (acc, curr) => acc?.[curr],
        documentoCadastral
      );
      newRow[header] = value ?? "";
    });

    return newRow;
  });

  return { json };
};

module.exports = { exportar, importar };
