const UsuarioService = require("../../services/usuario");
const Usuario = require("../../models/Usuario");
const bcrypt = require("bcryptjs");
const emailUtils = require("../../../packages/central-oon-core-backend/src/utils/emailUtils");
const jwt = require("jsonwebtoken");

const {
  sendErrorResponse,
  sendPaginatedResponse,
  sendResponse,
} = require("../../../packages/central-oon-core-backend/src/utils/helpers");

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
  const { email, senha } = req.body;
  const usuario = await UsuarioService.login({ email, senha });

  sendResponse({
    res,
    statusCode: 200,
    token: usuario.gerarToken(),
    usuario: {
      _id: usuario._id,
      nome: usuario.nome,
      tipo: usuario.tipo,
      idioma: usuario?.configuracoes?.idioma,
    },
  });
};

const validarToken = async (req, res) => {
  // Se passou pelo middleware, `req.usuario` já está preenchido
  sendResponse({ res, statusCode: 200, usuario: req.usuario });
};

const esqueciMinhaSenha = async (req, res) => {
  const { email } = req.body;

  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });
  const token = usuario.gerarToken();

  const baseUrl =
    usuario.tipo === "prestador"
      ? process.env.BASE_URL_APP_PUBLISHER
      : process.env.BASE_URL_CST;

  const path =
    usuario.tipo === "prestador" ? "/recover-password" : "/alterar-senha";

  const url = new URL(path, baseUrl);
  url.searchParams.append("code", token);

  await emailUtils.emailEsqueciMinhaSenha({
    usuario,
    url: url.toString(),
  });

  sendResponse({ res, statusCode: 200, usuario, message: "Email enviado" });
};

const alterarSenha = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { senhaAtual, novaSenha, confirmacao, code } = req.body;

  if (!token && !code) {
    return sendErrorResponse({
      res,
      statusCode: 401,
      message: "Token inválido ou expirado",
    });
  }

  if (!novaSenha) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: "Nova senha é um campo obrigatório",
    });
  }

  if (!confirmacao) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: "Confirmação é um compo obrigatório",
    });
  }

  if (novaSenha !== confirmacao) {
    return sendErrorResponse({
      res,
      statusCode: 400,
      message: "A confirmação precisa ser igual a senha.",
    });
  }

  if (code) {
    try {
      const decoded = jwt.verify(code, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);
      usuario.senha = novaSenha;
      await usuario.save();
      return sendResponse({
        res,
        statusCode: 200,
        token: code,
        usuario: {
          _id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo,
        },
      });
    } catch (error) {
      return sendErrorResponse({
        res,
        statusCode: 401,
        message: "Token inválido.",
      });
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);

      if (!(await bcrypt.compare(senhaAtual, usuario.senha)))
        return sendErrorResponse({
          res,
          statusCode: 401,
          message: "Credenciais inválidas",
        });

      usuario.senha = novaSenha;
      await usuario.save();
      return sendResponse({
        res,
        statusCode: 200,
        token,
        usuario: {
          _id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo,
        },
      });
    } catch (error) {
      return sendErrorResponse({
        res,
        statusCode: 401,
        message: "Token inválido.",
      });
    }
  }

  return sendErrorResponse({
    res,
    statusCode: 404,
    message: "Token inválido.",
  });
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
