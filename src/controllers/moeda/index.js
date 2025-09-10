const MoedaService = require("../../services/moeda");
const { helpers: Helpers } = require("central-oon-core-backend");

// const criar = async (req, res) => {
//   const pessoa = await MoedaService.criar({ pessoa: req.body });
//   sendResponse({ res, statusCode: 201, pessoa });
// };

// const atualizar = async (req, res) => {
//   const pessoa = await MoedaService.atualizar({
//     id: req.params.id,
//     pessoa: req.body,
//   });
//   sendResponse({ res, statusCode: 200, pessoa });
// };

// const excluir = async (req, res) => {
//   const pessoaExcluida = await MoedaService.excluir({ id: req.params.id });
//   sendResponse({ res, statusCode: 200, pessoa: pessoaExcluida });
// };

// const obterPorId = async (req, res) => {
//   const pessoa = await MoedaService.buscarPorId({ id: req.params.id });
//   return pessoa;
// };

const listarComPaginacao = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { limite, page, moedas, totalDeMoedas } =
    await MoedaService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  Helpers.sendPaginatedResponse({
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

const listarAtivas = async (req, res) => {
  const moedas = await MoedaService.listarAtivas();
  Helpers.sendResponse({
    res,
    moedas,
    statusCode: 200,
  });
};

const atualizarCotacao = async (req, res) => {
  await MoedaService.atualizarCotacao();

  return Helpers.sendResponse({
    res,
    statusCode: 200,
  });
};

module.exports = {
  // criar,
  // atualizar,
  // excluir,
  listarAtivas,
  atualizarCotacao,
  listarComPaginacao,
  // obterPorId,
  // importarPessoa,
  // exportar,
};
