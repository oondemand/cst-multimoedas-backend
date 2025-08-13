const IntegracaoService = require("../../services/integracao");
const Helpers = require("../../utils/helpers");
const PessoaSync = require("../../services/pessoa/omie");
const ContaPagarSync = require("../../services/contaPagar/omie");
const ArquivosSync = require("../../services/arquivo/omie");

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
  const { tipo, direcao } = req.body;

  if (!tipo || !direcao) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: 404,
      message: "Parâmetros obrigatórios [tipo, direcao]",
    });
  }

  const integracao = {
    pessoa: {
      omie_central: PessoaSync.omieCentral.queue.start,
      central_omie: PessoaSync.centralOmie.queue.start,
    },
    conta_pagar: {
      omie_central: ContaPagarSync.omieCentral.queue.start,
      central_omie: ContaPagarSync.centralOmie.queue.start,
    },
    anexos: {
      central_omie: ArquivosSync.centralOmie.queue.start,
    },
  };

  integracao[tipo][direcao]();
  console.log(`🚀 [INTEGRAÇÃO] [TIPO: ${tipo}] [DIREÇÃO: ${direcao}]`);

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
