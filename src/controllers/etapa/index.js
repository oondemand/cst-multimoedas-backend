const EtapaService = require("../../services/etapa");
const { sendResponse, sendPaginatedResponse } = require("../../../central-oon-core-backend/utils/helpers");

const criarEtapa = async (req, res) => {
  const etapa = await EtapaService.criar({ etapa: req.body });
  sendResponse({
    res,
    statusCode: 201,
    etapa,
  });
};

const listarEtapas = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { etapas, limite, totalDeEtapas, page } =
    await EtapaService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: etapas,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeEtapas / limite),
      totalItems: totalDeEtapas,
      itemsPerPage: limite,
    },
  });
};

const listarEtapasAtivasPorEsteira = async (req, res) => {
  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: req.params.esteira,
  });
  sendResponse({
    res,
    statusCode: 200,
    etapas,
  });
};

const atualizarEtapa = async (req, res) => {
  const etapa = await EtapaService.atualizar({
    etapa: req.body,
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 200,
    etapa,
  });
};

const excluir = async (req, res) => {
  const etapa = await EtapaService.excluir({ id: req.params.id });
  sendResponse({
    res,
    statusCode: 200,
    etapa,
  });
};

module.exports = {
  criarEtapa,
  listarEtapas,
  listarEtapasAtivasPorEsteira,
  atualizarEtapa,
  excluir,
};
