const path = require('path');
const ControleAlteracao = require('../../models/ControleAlteracao');
const FiltersUtils = require('../../utils/pagination/filter');
const PaginationUtils = require('../../utils/pagination');
const Usuario = require('../../models/Usuario');

const buscarIdsUsuariosFiltrados = async ({ nome, searchTerm }) => {
  if (!nome && !searchTerm) return [];

  const usuariosQuery = FiltersUtils.buildQuery({
    filtros: { nome },
    schema: Usuario.schema,
    searchTerm,
    camposBusca: ['nome'],
  });

  const usuariosIds = await Usuario.find({
    $and: usuariosQuery,
  }).select('_id');

  return usuariosIds.length > 0 ? usuariosIds.map((e) => e._id) : [];
};

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  nome,
  filtros,
}) => {
  const arrayIdsUsuarios = await buscarIdsUsuariosFiltrados({
    nome,
    searchTerm,
  });

  const controleQuery = FiltersUtils.buildQuery({
    filtros,
    schema: ControleAlteracao.schema,
    searchTerm,
    camposBusca: ['status', 'dataHora'],
  });

  const queryCombinada = {
    $and: [
      ...controleQuery,
      ...(arrayIdsUsuarios.length > 0 ? [{ usuario: { $in: arrayIdsUsuarios } }] : []),
    ],
  };

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [registros, totalRegistros] = await Promise.all([
    ControleAlteracao.find(queryCombinada)
      .skip(skip)
      .limit(limite)
      .sort({ dataHora: -1 })
      .select('-__v'),
    ControleAlteracao.countDocuments(queryCombinada),
  ]);

  return { registros, totalRegistros, page, limite };
};

module.exports = {
  listarComPaginacao,
};
