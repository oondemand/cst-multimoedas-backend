const ImportacaoService = require("../services/importacao");
const { sendPaginatedResponse } = require("../utils/helpers");

const listar = async (req, res) => {
  const { pageIndex = 0, pageSize = 10, tipo } = req.query;
  const { importacoes, totalImportacoes, limite, page } =
    await ImportacaoService.listar({
      pageIndex,
      pageSize,
      filtros: { tipo },
    });

  sendPaginatedResponse({
    res,
    results: importacoes,
    statusCode: 200,
    pagination: {
      currentPage: page,
      itemsPerPage: limite,
      totalItems: totalImportacoes,
      totalPages: Math.ceil(totalImportacoes / limite),
    },
  });
};

module.exports = { listar };
