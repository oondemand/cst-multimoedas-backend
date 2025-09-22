const { excelToJson } = require("../../../../packages/central-oon-core-backend/src/utils/excel.js");
const { registrarAcao } = require("../../controleService.js");
const {
  ACOES,
  ENTIDADES,
  ORIGENS,
} = require("../../../constants/controleAlteracao.js");
const { mapImporter } = require("./mapImporter.js");
const { mapExporter } = require("./mapExporter");
const Pessoa = require("../../../models/Pessoa");
const Lista = require("../../../models/Lista.js");
const PessoaService = require("../../pessoa");

const criarNovoGrupo = async ({ grupo, usuario }) => {
  const grupos = await Lista.findOne({ codigo: "grupo" });
  const grupoExistente = grupos.data.some(
    (e) => e?.valor?.trim() === grupo?.trim()
  );

  if (!grupoExistente) {
    grupos.data.push({ valor: grupo?.trim() });
    await grupos.save();

    registrarAcao({
      acao: ACOES.ADICIONADO,
      entidade: ENTIDADES.CONFIGURACAO_LISTA_GRUPO,
      origem: ORIGENS.IMPORTACAO,
      dadosAtualizados: grupos,
      idRegistro: grupos._id,
      usuario: usuario,
    });
  }
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

const buscarPessoaPorDocumentoEAtualizar = async ({
  documento,
  pessoa,
  usuario,
}) => {
  if (!documento || !pessoa) return null;

  const pessoaExistente = await Pessoa.findOne({
    documento,
    status: { $ne: "arquivado" },
  });
  if (!pessoaExistente) return null;

  const pessoaAtualizada = await Pessoa.findByIdAndUpdate({
    id: pessoaExistente._id,
    pessoa,
  });

  registrarAcao({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.PESSOA,
    origem: ORIGENS.IMPORTACAO,
    dadosAtualizados: pessoaAtualizada,
    idRegistro: pessoaAtualizada._id,
    usuario: usuario,
  });

  return pessoaAtualizada;
};

const processarJsonPessoas = async ({ json, usuario }) => {
  const detalhes = {
    totalDeLinhasLidas: json.length - 1,
    linhasLidasComErro: 0,
    novasPessoas: 0,
    errors: "",
  };

  const arquivoDeErro = [];

  for (const [i, row] of json.entries()) {
    try {
      if (i === 0) {
        arquivoDeErro.push(row);
        continue;
      }

      const pessoaObj = await mapImporter({ row });

      let pessoa = await buscarPessoaPorDocumentoEAtualizar({
        documento: pessoaObj?.documento,
        pessoa: pessoaObj,
        usuario,
      });

      await criarNovoGrupo({ grupo: pessoaObj?.grupo, usuario });

      if (!pessoa) {
        await criarNovaPessoa({
          pessoa: pessoaObj,
          usuario,
        });

        detalhes.novasPessoas += 1;
      }
    } catch (error) {
      arquivoDeErro.push(row);
      detalhes.linhasLidasComErro += 1;
      detalhes.errors += `❌ [ERROR AO PROCESSAR LINHA]: ${i + 1} [PESSOA: ${
        row[1]
      }] - \nDETALHES DO ERRO: ${error}\n\n`;
    }
  }

  return { detalhes, arquivoDeErro };
};

const importarPessoa = async ({ arquivo, usuario }) => {
  const json = excelToJson({ arquivo });

  const { detalhes, arquivoDeErro } = await processarJsonPessoas({
    json,
    usuario,
  });

  return { detalhes, arquivoDeErro };
};

const exportarPessoa = async ({ filtros, pageIndex, pageSize, searchTerm }) => {
  const { pessoas } = await PessoaService.listarComPaginacao({
    filtros,
    pageIndex,
    pageSize,
    searchTerm,
  });

  const json = pessoas.map((pessoa) => {
    const newRow = {};

    Object.entries(mapExporter()).forEach(([header, key]) => {
      const accessor = key?.split(".") || [];
      const value = accessor.reduce((acc, curr) => acc?.[curr], pessoa);
      newRow[header] = value ?? "";
    });

    return newRow;
  });

  return { json };
};

module.exports = { importarPessoa, exportarPessoa };
