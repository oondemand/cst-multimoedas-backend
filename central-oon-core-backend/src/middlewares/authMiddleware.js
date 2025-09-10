const createHttpClient = require('../config/httpClient');
const apiMeusApps = createHttpClient({
  baseURL: process.env.MEUS_APPS_BACKEND_URL,
});
const { sendErrorResponse } = require('../utils/response');

function authMiddleware({ getOrigin }) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendErrorResponse({
        res,
        statusCode: 401,
        message: 'Acesso não autorizado. Token ausente.',
      });
    }

    try {
      const origin = await getOrigin();
      const response = await apiMeusApps.get('/auth/autenticar-aplicativo/', {
        headers: {
          Authorization: `Bearer ${token}`,
          origin,
        },
      });

      const usuario = {
        tipo:
          response.data.usuario.aplicativo.tipoAcesso === 'master'
            ? 'admin'
            : response.data.usuario.aplicativo.tipoAcesso,
        nome: response.data.usuario.nome,
        email: response.data.usuario.email,
      };

      req.usuario = usuario;
      next();
    } catch (error) {
      return sendErrorResponse({
        res,
        statusCode: 401,
        message: 'Token inválido ou erro na autenticação externa.',
      });
    }
  };
}

module.exports = authMiddleware;

