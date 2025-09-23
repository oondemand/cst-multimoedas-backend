const { excelToJson } = require("../../../../central-oon-core-backend/utils/excel.js");
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
const ServicoService = require("../../servico");
const Pessoa = require("../../../models/Pessoa");

// const criarNovoTipoDeServico = async ({ tipo, usuario }) => {
//   const tipos = await Lista.findOne({ codigo: "tipo-servico-tomado" });
//   const tipoExistente = tipos.data.some(
//     (e) => e?.valor?.trim() === tipo?.trim()
//   );

//   if (!tipoExistente) {
//     tipos.data.push({ valor: tipo?.trim() });
//     await tipos.save();

//     registrarAcao({
//       acao: ACOES.ADICIONADO,
//       entidade: ENTIDADES.CONFIGURACAO_LISTA_TIPO_SERVICO_TOMADO,
//       origem: ORIGENS.IMPORTACAO,
//       dadosAtualizados: tipos,
//       idRegistro: tipos._id,
//       usuario: usuario,
//     });
//   }
// };

const criarNovaServico = async ({ servico, usuario }) => {
  const novaServico = new Servico(servico);

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.SERVICO,
    origem: ORIGENS.IMPORTACAO,
    dadosAtualizados: novaServico,
    idRegistro: novaServico._id,
    usuario: usuario,
  });

  await novaServico.save();
  return novaServico;
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

// const buscarServicoPorDocumentoEAtualizar = async ({
//   documento,
//   servico,
//   usuario,
// }) => {
//   if (!documento || !servico) return null;

//   const servicoExistente = await Servico.findOne({
//     documento,
//     status: { $ne: "arquivado" },
//   });
//   if (!servicoExistente) return null;

//   const servicoAtualizada = await Servico.findByIdAndUpdate({
//     id: servicoExistente._id,
//     servico,
//   });

//   registrarAcao({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.SERVICO,
//     origem: ORIGENS.IMPORTACAO,
//     dadosAtualizados: servicoAtualizada,
//     idRegistro: servicoAtualizada._id,
//     usuario: usuario,
//   });

//   return servicoAtualizada;
// };

const processarJsonServicos = async ({ json, usuario }) => {
  const detalhes = {
    totalDeLinhasLidas: json.length - 1,
    linhasLidasComErro: 0,
    novosServicos: 0,
    errors: "",
  };

  const arquivoDeErro = [];

  for (const [i, row] of json.entries()) {
    try {
      if (i === 0) {
        arquivoDeErro.push(row);
        continue;
      }

      const servicoObj = await mapImporter({ row });

      let pessoa = await buscarPessoaPorDocumento({
        documento: servicoObj?.pessoa?.documento,
      });

      if (!pessoa) {
        pessoa = await criarNovaPessoa({
          pessoa: servicoObj.pessoa,
          usuario,
        });
      }

      // let servico = await buscarServicoPorDocumentoEAtualizar({
      //   documento: servicoObj?.documento,
      //   servico: servicoObj,
      //   usuario,
      // });

      // await criarNovoTipoDeServico({ tipo: servicoObj?.tipo, usuario });

      // if (!servico) {
      await criarNovaServico({
        servico: { ...servicoObj, pessoa: pessoa._id },
        usuario,
      });

      detalhes.novosServicos += 1;
      // }
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

const importarServico = async ({ arquivo, usuario }) => {
  const json = excelToJson({ arquivo });

  const { detalhes, arquivoDeErro } = await processarJsonServicos({
    json,
    usuario,
  });

  return { detalhes, arquivoDeErro };
};

const exportarServico = async ({
  filtros,
  pageIndex,
  pageSize,
  searchTerm,
}) => {
  const { servicos } = await ServicoService.listarComPaginacao({
    filtros,
    pageIndex,
    pageSize,
    searchTerm,
  });

  const servicosComCotacao = await ServicoService.adicionarCotacao({
    servicos,
  });

  const json = servicosComCotacao.map((servico) => {
    const newRow = {};

    Object.entries(mapExporter()).forEach(([header, key]) => {
      const accessor = key?.split(".") || [];
      const value = accessor.reduce((acc, curr) => acc?.[curr], servico);
      newRow[header] = value ?? "";
    });

    return newRow;
  });

  return { json };
};

module.exports = { exportarServico, importarServico };
