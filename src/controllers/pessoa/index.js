const PessoaService = require("../../services/pessoa");
const PessoaExcel = require("../../services/pessoa/excel");
const ImportacaoService = require("../../services/importacao");
const { sendPaginatedResponse, sendResponse } = require("../../../packages/central-oon-core-backend/src/utils/helpers");
const { arrayToExcelBuffer, excelToJson } = require("../../../packages/central-oon-core-backend/src/utils/excel");

const criar = async (req, res) => {
  const pessoa = await PessoaService.criar({ pessoa: req.body });
  sendResponse({ res, statusCode: 201, pessoa });
};

const atualizar = async (req, res) => {
  const pessoa = await PessoaService.atualizar({
    id: req.params.id,
    pessoa: req.body,
  });
  sendResponse({ res, statusCode: 200, pessoa });
};

const excluir = async (req, res) => {
  const pessoaExcluida = await PessoaService.excluir({ id: req.params.id });
  sendResponse({ res, statusCode: 200, pessoa: pessoaExcluida });
};

const obterPorId = async (req, res) => {
  const pessoa = await PessoaService.buscarPorId({ id: req.params.id });
  return pessoa;
};

const listar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { limite, page, pessoas, totalDePessoas } =
    await PessoaService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: pessoas,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDePessoas / limite),
      totalItems: totalDePessoas,
      itemsPerPage: limite,
    },
  });
};

const importarPessoa = async (req, res) => {
  const importacao = await ImportacaoService.criar({
    arquivo: req.files[0],
    tipo: "pessoa",
  });

  sendResponse({
    res,
    statusCode: 200,
    importacao,
  });

  const { arquivoDeErro, detalhes } = await PessoaExcel.importarPessoa({
    arquivo: req.files[0],
    usuario: req.usuario,
  });

  importacao.arquivoErro = arrayToExcelBuffer({
    array: arquivoDeErro,
    title: "errors",
  });

  importacao.arquivoLog = Buffer.from(detalhes.errors);
  importacao.detalhes = detalhes;

  await importacao.save();
};

const exportar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { json } = await PessoaExcel.exportarPessoa({
    filtros: rest,
    pageIndex,
    pageSize,
    searchTerm,
  });

  const buffer = arrayToExcelBuffer({ array: json, title: "exported" });

  sendResponse({
    res,
    statusCode: 200,
    buffer,
  });
};

module.exports = {
  criar,
  atualizar,
  excluir,
  listar,
  obterPorId,
  importarPessoa,
  exportar,
};
