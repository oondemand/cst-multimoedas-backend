const UsuarioService = require('../../../src/services/usuario');
const Usuario = require('../../../src/models/Usuario');
const emailUtils = require('../../../src/utils/emailUtils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const GenericError = require('../errors/GenericError');

/**
 * Realiza o login do usuário e retorna token e dados do usuário.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.senha
 * @param {string} [params.origin]
 */
async function login({ email, senha }) {
  const usuario = await UsuarioService.login({ email, senha });

  return {
    token: usuario.gerarToken(),
    usuario: {
      _id: usuario._id,
      nome: usuario.nome,
      tipo: usuario.tipo,
      idioma: usuario?.configuracoes?.idioma,
    },
  };
}

/**
 * Valida um token JWT e retorna o usuário associado.
 * @param {Object} params
 * @param {string} params.token
 * @param {string} [params.origin]
 */
async function validateToken({ token }) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      throw new GenericError('Token inválido ou expirado', 401);
    }

    return { usuario };
  } catch (error) {
    throw new GenericError('Token inválido ou expirado', 401);
  }
}

/**
 * Envia email de recuperação de senha para o usuário informado.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} [params.origin]
 */
async function recoverPassword({ email }) {
  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });
  const token = usuario.gerarToken();

  const baseUrl =
    usuario.tipo === 'prestador'
      ? process.env.BASE_URL_APP_PUBLISHER
      : process.env.BASE_URL_CST;

  const path = usuario.tipo === 'prestador' ? '/recover-password' : '/alterar-senha';

  const url = new URL(path, baseUrl);
  url.searchParams.append('code', token);

  await emailUtils.emailEsqueciMinhaSenha({
    usuario,
    url: url.toString(),
  });

  return { usuario, message: 'Email enviado' };
}

/**
 * Altera a senha do usuário utilizando token ou código de autorização.
 * @param {Object} params
 * @param {string} [params.token]
 * @param {string} [params.code]
 * @param {string} params.senhaAtual
 * @param {string} params.novaSenha
 * @param {string} params.confirmacao
 * @param {string} [params.origin]
 */
async function changePassword({ token, senhaAtual, novaSenha, confirmacao, code }) {
  if (!token && !code) {
    throw new GenericError('Token inválido ou expirado', 401);
  }

  if (!novaSenha) {
    throw new GenericError('Nova senha é um campo obrigatório', 404);
  }

  if (!confirmacao) {
    throw new GenericError('Confirmação é um compo obrigatório', 404);
  }

  if (novaSenha !== confirmacao) {
    throw new GenericError('A confirmação precisa ser igual a senha.', 400);
  }

  if (code) {
    try {
      const decoded = jwt.verify(code, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);
      usuario.senha = novaSenha;
      await usuario.save();
      return {
        token: code,
        usuario: {
          _id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo,
        },
      };
    } catch (error) {
      throw new GenericError('Token inválido.', 401);
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);

      if (!(await bcrypt.compare(senhaAtual, usuario.senha))) {
        throw new GenericError('Credenciais inválidas', 401);
      }

      usuario.senha = novaSenha;
      await usuario.save();
      return {
        token,
        usuario: {
          _id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo,
        },
      };
    } catch (error) {
      throw new GenericError('Token inválido.', 401);
    }
  }

  throw new GenericError('Token inválido.', 404);
}

module.exports = {
  login,
  validateToken,
  recoverPassword,
  changePassword,
};

