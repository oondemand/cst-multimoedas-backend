const Usuario = require("../../models/Usuario");
const CredenciaisInvalidasError = require("../errors/usuario/credenciaisInvalidas");
const UsuarioNaoEncontradoError = require("../errors/usuario/usuarioNaoEncontrado");
const bcrypt = require("bcryptjs");
const FiltersUtils = require("../../../central-oon-core-backend/utils/pagination/filter");
const PaginationUtils = require("../../../central-oon-core-backend/utils/pagination");

const criar = async ({ usuario }) => {
  const novoUsuario = new Usuario(usuario);
  return await novoUsuario.save();
};

const atualizar = async ({ id, usuario }) => {
  const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, usuario, {
    new: true,
  });
  if (!usuarioAtualizado) return new UsuarioNaoEncontradoError();
  return usuarioAtualizado;
};

const excluir = async ({ id }) => {
  const usuarioExcluido = await Usuario.findByIdAndUpdate(id, {
    status: "arquivado",
  });
  if (!usuarioExcluido) return new UsuarioNaoEncontradoError();
  return usuarioExcluido;
};

const buscarUsuarioPorId = async ({ id }) => {
  const usuario = await Usuario.findById(id);
  if (!usuario || !id) throw new UsuarioNaoEncontradoError();
  return usuario;
};

const buscarUsuarioPorEmail = async ({ email }) => {
  const usuario = await Usuario.findOne({
    email,
    status: { $ne: "arquivado" },
  });
  if (!usuario || !email) throw new UsuarioNaoEncontradoError();
  return usuario;
};

const login = async ({ email, senha }) => {
  const usuario = await buscarUsuarioPorEmail({ email });
  if (!(await bcrypt.compare(senha, usuario.senha)))
    throw new CredenciaisInvalidasError();
  return usuario;
};

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const schema = Usuario.schema;
  const camposBusca = ["status", "nome", "email", "tipo"];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [usuarios, totalDeUsuarios] = await Promise.all([
    Usuario.find({
      $and: [{ status: { $ne: "arquivado" } }, ...query],
    })
      .skip(skip)
      .limit(limite),
    Usuario.countDocuments({
      $and: [{ status: { $ne: "arquivado" } }, ...query],
    }),
  ]);

  return { usuarios, totalDeUsuarios, page, limite };
};

module.exports = {
  criar,
  login,
  excluir,
  atualizar,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  listarComPaginacao,
};
