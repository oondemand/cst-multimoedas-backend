const MoedaService = require('../services/moeda');
const { sendPaginatedResponse, sendResponse } = require('../utils/helpers');

const listarComPaginacao = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { limite, page, moedas, totalDeMoedas } = await MoedaService.listarComPaginacao({
    filtros: rest,
    pageIndex,
    pageSize,
    searchTerm,
  });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: moedas,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeMoedas / limite),
      totalItems: totalDeMoedas,
      itemsPerPage: limite,
    },
  });
};

const listarAtivas = async (_req, res) => {
  const moedas = await MoedaService.listarAtivas();
  sendResponse({
    res,
    statusCode: 200,
    moedas,
  });
};

const atualizarCotacao = async (_req, res) => {
  await MoedaService.atualizarCotacao();
  sendResponse({
    res,
    statusCode: 200,
  });
};

module.exports = {
  listarComPaginacao,
  listarAtivas,
  atualizarCotacao,
};
