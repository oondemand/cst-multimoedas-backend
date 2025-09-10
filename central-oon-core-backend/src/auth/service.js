const createHttpClient = require('../config/httpClient');

const api = createHttpClient({
  baseURL: process.env.MEUS_APPS_BACKEND_URL,
});

/**
 * Realiza o login do usuário utilizando o serviço central de autenticação.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.senha
 * @param {string} params.origin
 */
async function login({ email, senha, origin }) {
  const { data } = await api.post(
    '/auth/login',
    { email, senha },
    { headers: { origin } },
  );
  return data;
}

/**
 * Valida um token JWT junto ao serviço central de autenticação.
 * @param {Object} params
 * @param {string} params.token
 * @param {string} params.origin
 */
async function validateToken({ token, origin }) {
  const { data } = await api.get('/auth/validar-token', {
    headers: {
      Authorization: `Bearer ${token}`,
      origin,
    },
  });
  return data;
}

/**
 * Solicita a recuperação de senha para o e-mail informado.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.origin
 */
async function recoverPassword({ email, origin }) {
  const { data } = await api.post(
    '/auth/esqueci-minha-senha',
    { email },
    { headers: { origin } },
  );
  return data;
}

/**
 * Altera a senha do usuário utilizando token de autorização.
 * @param {Object} params
 * @param {string} params.token
 * @param {string} params.senhaAtual
 * @param {string} params.novaSenha
 * @param {string} params.origin
 */
async function changePassword({ token, senhaAtual, novaSenha, origin }) {
  const { data } = await api.post(
    '/auth/alterar-senha',
    { senhaAtual, novaSenha },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        origin,
      },
    },
  );
  return data;
}

module.exports = {
  login,
  validateToken,
  recoverPassword,
  changePassword,
};
