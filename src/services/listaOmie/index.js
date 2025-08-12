const ListaOmieNaoEncontradaError = require("../errors/listaOmie/listaOmieNaoEncontradaError");
const { syncWithOmie } = require("./omie/sync");
const ListaOmie = require("../../models/ListaOmie");

const atualizar = async ({ id, lista }) => {
  const listaAtualizada = await ListaOmie.findByIdAndUpdate(id, lista).select(
    "-__v -data"
  );

  if (!lista || !id) throw new ListaOmieNaoEncontradaError();
  return listaAtualizada;
};

const listAll = async () => {
  return await ListaOmie.find().select("-__v -fields -select");
};

const obterListaPorCodigo = async ({ codigo }) => {
  const lista = await ListaOmie.findOne({
    codigo,
  }).select("data");

  if (!lista || !codigo) throw new ListaOmieNaoEncontradaError();
  return lista;
};

const criar = async ({ lista }) => {
  const novaLista = new ListaOmie(lista);
  await novaLista.save();
  return novaLista;
};

const excluir = async ({ id }) => {
  const lista = await ListaOmie.findByIdAndDelete(id);
  if (!id || !lista) throw new ListaOmieNaoEncontradaError();
  return lista;
};

module.exports = {
  criar,
  excluir,
  listAll,
  atualizar,
  syncWithOmie,
  obterListaPorCodigo,
};
