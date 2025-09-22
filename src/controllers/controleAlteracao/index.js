const ControleAlteracaoService = require("../../services/controleAlteracao");
const { sendPaginatedResponse } = require("../../../packages/central-oon-core-backend/src/utils/helpers");

const listarTodosRegistros = async (req, res) => {
  const {
    pageIndex,
    pageSize,
    searchTerm = "",
    tipo,
    ["usuario.nome"]: nome,
    ...rest
  } = req.query;

  const { limite, page, registros, totalRegistros } =
    await ControleAlteracaoService.listarComPaginacao({
      filtros: rest,
      nome,
      pageIndex,
      pageSize,
      searchTerm,
      tipo,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: registros,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRegistros / limite),
      totalItems: totalRegistros,
      itemsPerPage: limite,
    },
  });
};

module.exports = {
  listarTodosRegistros,
};
