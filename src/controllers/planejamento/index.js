const PlanejamentoService = require("../../services/planejamento");
const {
  helpers: { sendPaginatedResponse, sendResponse },
} = require("central-oon-core-backend");
const ServicoService = require("../../services/servico");

const listar = async (req, res) => {
  const {
    ["prestador.nome"]: nome,
    ["prestador.tipo"]: tipo,
    ["prestador.documento"]: documento,
    searchTerm,
    pageIndex,
    pageSize,
    ...rest
  } = req.query;

  const { limite, page, servicos, totalDeServicos } =
    await PlanejamentoService.listarServicosComPaginacao({
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
    results: servicosComCotacao,
    statusCode: 200,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeServicos / limite),
      totalItems: totalDeServicos,
      itemsPerPage: limite,
    },
  });
};

const estatisticas = async (req, res) => {
  const estatisticas = await PlanejamentoService.estatisticas();
  sendResponse({ res, statusCode: 200, estatisticas });
};

const processarMultiplosServicos = async (req, res) => {
  const result = await PlanejamentoService.processarMultiplosServicos({
    ids: req.body.ids,
    statusProcessamento: req.body.statusProcessamento,
    usuario: req.usuario,
  });

  sendResponse({ res, statusCode: 200, result });
};

const processarServico = async (req, res) => {
  const servico = PlanejamentoService.processarServico({
    id: req.params.id,
    servico: req.body,
    usuario: req.usuario,
  });

  sendResponse({ res, statusCode: 200, servico });
};

const sincronizarEsteira = async (req, res) => {
  await PlanejamentoService.sincronizarEsteira({
    usuario: req.usuario,
  });

  return sendResponse({
    res,
    statusCode: 200,
  });
};

module.exports = {
  listar,
  estatisticas,
  processarMultiplosServicos,
  processarServico,
  sincronizarEsteira,
};
