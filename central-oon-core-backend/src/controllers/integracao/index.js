const path = require("path");
const IntegracaoService = require("../../services/integracao");
const IntegracaoConfigService = require("../../services/integracao/config");
const {
  sendResponse,
  sendPaginatedResponse,
  sendErrorResponse,
} = require("../../utils/helpers");

// Services that live in the main application (outside the core package)
const PessoaSync = require(path.join(
  process.cwd(),
  "src",
  "services",
  "pessoa",
  "omie"
));
const ContaPagarSync = require(path.join(
  process.cwd(),
  "src",
  "services",
  "contaPagar",
  "omie"
));
const ArquivosSync = require(path.join(
  process.cwd(),
  "src",
  "services",
  "arquivo",
  "omie"
));

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

const processar = async (req, res) => {
  const { tipo, direcao } = req.body;

  if (!tipo || !direcao) {
    return sendErrorResponse({
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

  sendResponse({
    res,
    statusCode: 200,
  });
};

const processarAtivas = async (req, res) => {
  const integracoesConfigs = await IntegracaoConfigService.listar();

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

  const promises = [];

  for (const config of integracoesConfigs) {
    if (config.ativa) {
      console.log(
        `🚀 [PROCESSANDO INTEGRAÇÃO] [TIPO: ${config.tipo}] [DIREÇÃO: ${config.direcao}] [ATIVA: ${config.ativa}]`
      );
      promises.push(integracao[config.tipo][config.direcao]());
    }
  }

  await Promise.all(promises);

  sendResponse({
    res,
    statusCode: 200,
    message: "Processando integrações ativas.",
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
  processar,
  reprocessar,
  listarConfigs,
  processarAtivas,
  atualizarConfig,
  listaComPaginacao,
};
