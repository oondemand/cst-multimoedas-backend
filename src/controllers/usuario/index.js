const UsuarioService = require("../../services/usuario");

const { login, validateToken: validateTokenCore, recoverPassword, changePassword } =
  require("central-oon-core-backend");

const { sendPaginatedResponse, sendResponse } = require("../../utils/helpers");

const criarUsuario = async (req, res) => {
  const usuario = await UsuarioService.criar({ usuario: req.body });
  sendResponse({ res, statusCode: 201, usuario });
};

const obterUsuario = async (req, res) => {
  const usuario = await UsuarioService.buscarUsuarioPorId(req.params.id);
  sendResponse({ res, statusCode: 200, usuario });
};

const atualizarUsuario = async (req, res) => {
  const usuario = await UsuarioService.atualizar({
    id: req.params.id,
    usuario: req.body,
  });

  sendResponse({ res, statusCode: 200, usuario });
};

const excluirUsuario = async (req, res) => {
  const usuario = await UsuarioService.excluir({ id: req.params.id });
  sendResponse({ res, statusCode: 200, usuario });
};

const loginUsuario = async (req, res) => {
  const data = await login(req.body);
  sendResponse({ res, statusCode: 200, ...data });
};

const validarToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = await validateTokenCore({ token });
  sendResponse({ res, statusCode: 200, ...data });
};

const esqueciMinhaSenha = async (req, res) => {
  const data = await recoverPassword(req.body);
  sendResponse({ res, statusCode: 200, ...data });
};

const alterarSenha = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = await changePassword({ ...req.body, token });
  sendResponse({ res, statusCode: 200, ...data });
};

const listarUsuarios = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { limite, page, totalDeUsuarios, usuarios } =
    await UsuarioService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: usuarios,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeUsuarios / limite),
      totalItems: totalDeUsuarios,
      itemsPerPage: limite,
    },
  });
};

module.exports = {
  listarUsuarios,
  criarUsuario,
  obterUsuario,
  atualizarUsuario,
  excluirUsuario,
  validarToken,
  esqueciMinhaSenha,
  alterarSenha,
  loginUsuario,
};
