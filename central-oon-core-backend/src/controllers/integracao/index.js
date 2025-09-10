const IntegracaoService = require("../../services/integracao");
const IntegracaoConfigService = require("../../services/integracao/config");
const { sendResponse, sendPaginatedResponse } = require("../../utils/helpers");

const listar = async (req, res) => {
  const results = await IntegracaoService.listarTodos({
    tipo: req.query.tipo,
    direcao: req.query.direcao,
    time: req.query.time,
  });

  sendResponse({
    res,
    statusCode: 200,
    results,
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

  sendPaginatedResponse({
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

  sendResponse({
    res,
    integracao,
    statusCode: 200,
  });
};

const reprocessar = async (req, res) => {
  const { id } = req.params;
  const integracao = await IntegracaoService.reprocessar({ id });

  sendResponse({
    res,
    integracao,
    statusCode: 200,
  });
};

const atualizarConfig = async (req, res) => {
  const config = await IntegracaoConfigService.atualizar({
    id: req.params.id,
    config: req.body,
  });

  sendResponse({ res, statusCode: 200, config });
};

const listarConfigs = async (req, res) => {
  const configs = await IntegracaoConfigService.listar();
  sendResponse({ res, statusCode: 200, configs });
};

module.exports = {
  listar,
  arquivar,
  reprocessar,
  listarConfigs,
  atualizarConfig,
  listaComPaginacao,
};
