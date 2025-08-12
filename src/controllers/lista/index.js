const { sendResponse } = require("../../utils/helpers");
const { registrarAcao } = require("../../services/controleService");
const {
  ENTIDADES,
  ACOES,
  ORIGENS,
} = require("../../constants/controleAlteracao");
const ListaService = require("../../services/lista");

const createLista = async (req, res) => {
  const lista = await ListaService.create({ codigo: req.body.codigo });
  sendResponse({ res, statusCode: 201, lista });
};

const addItem = async (req, res) => {
  const lista = await ListaService.addItem({
    codigo: req.params.codigo,
    valor: req.body.valor,
  });

  const entidade = Object.entries(ENTIDADES).find(([_, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const removeItem = async (req, res) => {
  const { codigo, itemId } = req.params;
  const lista = await ListaService.removeItem({ codigo, itemId });

  const entidade = Object.entries(ENTIDADES).find(([key, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.EXCLUIDO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const getListas = async (req, res) => {
  const listas = await ListaService.obterListas();
  sendResponse({ res, statusCode: 200, listas });
};

const updateItem = async (req, res) => {
  const { codigo } = req.params;
  const { itemId, valor } = req.body;

  const lista = await ListaService.atualizarItem({ codigo, itemId, valor });
  const entidade = Object.entries(ENTIDADES).find(([key, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.ALTERADO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const getListaPorCodigo = async (req, res) => {
  const lista = await ListaService.obterListaPorCodigo({
    codigo: req.params.codigo,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const obterCodigos = async (req, res) => {
  const codigos = await ListaService.listarCodigoDeListas();
  sendResponse({
    res,
    statusCode: 200,
    codigos,
  });
};
module.exports = {
  addItem,
  getListas,
  removeItem,
  updateItem,
  createLista,
  obterCodigos,
  getListaPorCodigo,
};
