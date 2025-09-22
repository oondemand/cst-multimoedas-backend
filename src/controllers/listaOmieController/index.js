const ListaOmieService = require("../../services/listaOmie");
const { sendResponse } = require("../../../packages/central-oon-core-backend/src/utils/helpers");

const syncOmie = async (req, res) => {
  const lista = await ListaOmieService.syncWithOmie({ id: req.params.id });
  return sendResponse({
    res,
    statusCode: 200,
    message: "Lista sincronizada com sucesso",
    lista,
  });
};

const update = async (req, res) => {
  const lista = await ListaOmieService.atualizar({
    id: req.params.id,
    lista: req.body,
  });

  return sendResponse({
    res,
    statusCode: 200,
    lista,
  });
};

const listAll = async (req, res) => {
  const listas = await ListaOmieService.listAll();
  return sendResponse({
    res,
    statusCode: 200,
    listas,
  });
};

const getListaPorCodigo = async (req, res) => {
  const lista = await ListaOmieService.obterListaPorCodigo({
    codigo: req.params.codigo,
  });

  return sendResponse({
    res,
    statusCode: 200,
    lista: lista.data,
  });
};

const create = async (req, res) => {
  const lista = await ListaOmieService.criar({ lista: req.body });

  return sendResponse({
    res,
    statusCode: 200,
    lista,
  });
};

const deleteLista = async (req, res) => {
  const lista = await ListaOmieService.excluir({ id: req.params.id });
  return sendResponse({
    res,
    statusCode: 200,
    lista,
  });
};

exports.ListaOmieController = {
  update,
  listAll,
  getListaPorCodigo,
  create,
  deleteLista,
  syncOmie,
};
