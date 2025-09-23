const { sendResponse, sendPaginatedResponse } = require("../../../central-oon-core-backend/utils/helpers");
const AssistenteService = require("../../services/assistente");

const criarAssistente = async (req, res) => {
  const assistente = await AssistenteService.criar({ assistente: req.body });
  sendResponse({
    res,
    statusCode: 201,
    assistente,
  });
};

const listarAssistentes = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { assistentes, limite, page, totalDeAssistentes } =
    await AssistenteService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: assistentes,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeAssistentes / limite),
      totalItems: totalDeAssistentes,
      itemsPerPage: limite,
    },
  });
};

const listarAssistentesAtivos = async (req, res) => {
  const assistentes = await AssistenteService.listarTodosAssistentesAtivos();
  sendResponse({
    res,
    statusCode: 200,
    assistentes,
  });
};

const obterAssistente = async (req, res) => {
  const assistente = await AssistenteService.buscarAssistentePorId({
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 200,
    assistente,
  });
};

const atualizarAssistente = async (req, res) => {
  const assistente = await AssistenteService.atualizar({
    id: req.params.id,
    assistente: req.body,
  });

  sendResponse({
    res,
    statusCode: 200,
    assistente,
  });
};

const excluirAssistente = async (req, res) => {
  const assistente = await AssistenteService.excluir({ id: req.params.id });

  sendResponse({
    res,
    statusCode: 200,
    assistente,
  });
};

module.exports = {
  criarAssistente,
  listarAssistentes,
  listarAssistentesAtivos,
  obterAssistente,
  atualizarAssistente,
  excluirAssistente,
};
