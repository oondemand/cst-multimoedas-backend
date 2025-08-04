const IntegracaoService = require("../../services/integracao");
const Helpers = require("../../utils/helpers");
const PessoaSync = require("../../services/pessoa/omie");
const ContaPagarSync = require("../../services/contaPagar/omie");

const listar = async (req, res) => {
  const results = await IntegracaoService.listarTodos({
    tipo: req.query.tipo,
    direcao: req.query.direcao,
    time: req.query.time,
  });

  Helpers.sendResponse({
    res,
    statusCode: 200,
    results,
  });
};

const processar = async (req, res) => {
  // PessoaSync.centralOmie.queue.start();
  // PessoaSync.omieCentral.queue.start();

  ContaPagarSync.centralOmie.queue.start();
  ContaPagarSync.omieCentral.queue.start();

  Helpers.sendResponse({
    res,
    statusCode: 200,
  });
};

const listaComPaginacao = async (req, res) => {
  const { direcao, tipo, pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { integracoes, limite, page, totalDeIntegracoes } =
    await IntegracaoService.listarComPaginacao({
      direcao,
      tipo,
      pageSize,
      pageIndex,
      searchTerm,
      filtros: rest,
    });

  Helpers.sendPaginatedResponse({
    res,
    results: integracoes,
    statusCode: 200,
    pagination: {
      currentPage: page,
      itemsPerPage: limite,
      totalItems: totalDeIntegracoes,
      totalPages: totalDeIntegracoes / limite,
    },
  });
};

const arquivar = async (req, res) => {
  const { id } = req.params;
  const integracao = await IntegracaoService.arquivar({ id });

  Helpers.sendResponse({
    res,
    integracao,
    statusCode: 200,
  });
};

const reprocessar = async (req, res) => {
  const { id } = req.params;
  const integracao = await IntegracaoService.reprocessar({ id });

  Helpers.sendResponse({
    res,
    integracao,
    statusCode: 200,
  });
};

module.exports = {
  listar,
  arquivar,
  processar,
  reprocessar,
  listaComPaginacao,
};
