const { sendPaginatedResponse, sendResponse } = require("../../../central-oon-core-backend/utils/helpers");
const ServicoService = require("../../services/servico");
const ServicoExcel = require("../../services/servico/excel");
const { arrayToExcelBuffer } = require("../../../central-oon-core-backend/utils/excel");
const ImportacaoService = require("../../services/importacao");

const criar = async (req, res) => {
  const servico = await ServicoService.criar({ servico: req.body });
  sendResponse({ res, statusCode: 201, servico });
};

const atualizar = async (req, res) => {
  const servico = await ServicoService.atualizar({
    id: req.params.id,
    servico: req.body,
  });
  sendResponse({ res, statusCode: 200, servico });
};

const excluir = async (req, res) => {
  const servicoExcluida = await ServicoService.excluir({ id: req.params.id });
  sendResponse({ res, statusCode: 200, servico: servicoExcluida });
};

const obterPorId = async (req, res) => {
  const servico = await ServicoService.buscarPorId({ id: req.params.id });
  return servico;
};

const listar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;
  const { limite, page, servicos, totalDeServicos } =
    await ServicoService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  const servicosComCotacao = await ServicoService.adicionarCotacao({
    servicos,
  });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: servicosComCotacao,
    pagination: {
      currentPage: page,
      itemsPerPage: limite,
      totalItems: totalDeServicos,
      totalPages: Math.ceil(totalDeServicos / limite),
    },
  });
};

const importarServico = async (req, res) => {
  const importacao = await ImportacaoService.criar({
    arquivo: req.files[0],
    tipo: "servico",
  });

  sendResponse({
    res,
    statusCode: 200,
    importacao,
  });

  const { arquivoDeErro, detalhes } = await ServicoExcel.importarServico({
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

  const { json } = await ServicoExcel.exportarServico({
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

const listarServicoPorPessoa = async (req, res) => {
  const servicos = await ServicoService.listarTodosPorPessoa({
    pessoaId: req.params.pessoaId,
  });

  const servicosComCotacao = await ServicoService.adicionarCotacao({
    servicos,
  });

  sendResponse({
    res,
    statusCode: 200,
    servicos: servicosComCotacao,
  });
};

module.exports = {
  listar,
  criar,
  atualizar,
  obterPorId,
  excluir,
  exportar,
  importarServico,
  listarServicoPorPessoa,
};
