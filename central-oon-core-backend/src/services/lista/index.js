const Lista = require('../../models/Lista');
const path = require('path');
const ListaOmie = require(path.join(process.cwd(), 'src', 'models', 'ListaOmie'));
const { LISTAS } = require(path.join(process.cwd(), 'src', 'constants', 'listas'));
const GenericError = require('../../errors/GenericError');
const ListaNaoEncontradaError = require('../../errors/lista/listaNaoEncontrada');
const { validarMoedaExistente } = require('./validations');

const create = async ({ codigo }) => {
  const novaLista = new Lista({ codigo, data: [] });
  return await novaLista.save();
};

const addItem = async ({ codigo, valor }) => {
  let lista = await Lista.findOne({ codigo }).populate('data');

  if (!lista) {
    lista = new Lista({
      codigo,
    });
  }

  lista.data.push({ valor });
  return await lista.save();
};

const removeItem = async ({ codigo, itemId }) => {
  const lista = await Lista.findOne({ codigo }).populate('data');
  lista.data = lista.data.filter((item) => item._id != itemId);
  await lista.save();
  return lista;
};

const obterListas = async () => {
  const listas = await Lista.aggregate([
    { $addFields: { data: { $reverseArray: '$data' } } },
  ]);

  return listas;
};

const obterListaPorCodigo = async ({ codigo }) => {
  const lista = await Lista.findOne({ codigo });
  if (!lista || !codigo) throw new ListaNaoEncontradaError();
  lista.data = lista.data.filter((item) => item.valor);
  return lista;
};

const atualizarItem = async ({ codigo, itemId, valor }) => {
  const lista = await Lista.findOne({ codigo }).populate('data');
  if (!lista) throw new ListaNaoEncontradaError();

  if (codigo === 'moeda') {
    const moedaValida = await validarMoedaExistente({ moeda: valor });
    if (!moedaValida) throw new GenericError('Moeda não listada no BACEN', 404);
  }

  const index = lista.data.findIndex((item) => item._id == itemId);
  if (index === -1) throw new GenericError('Item não encontrado', 404);

  const trimmedValor = valor.trim();

  const valorExistente = lista.data.some((item) => item.valor === trimmedValor);

  if (valorExistente) throw new GenericError('Valor já existe na lista', 409);

  if (valor) lista.data[index].valor = valor;
  await lista.save();

  return lista;
};

const listarCodigoDeListas = async () => {
  const codigos = await Lista.distinct('codigo');
  const codigosOmie = await ListaOmie.distinct('codigo');
  return Array.from(
    new Set([...(LISTAS || []), ...codigos, ...codigosOmie])
  );
};

module.exports = {
  create,
  addItem,
  removeItem,
  obterListas,
  atualizarItem,
  obterListaPorCodigo,
  listarCodigoDeListas,
};
