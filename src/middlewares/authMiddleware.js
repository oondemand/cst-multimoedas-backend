const axios = require("axios");
const Sistema = require("../models/Sistema");
const Helpers = require("../utils/helpers");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return Helpers.sendErrorResponse({
      res,
      message: "Acesso não autorizado. Token ausente.",
      statusCode: 401,
    });
  }

  const sistema = await Sistema.findOne();

  try {
    const response = await axios.get(
      `${process.env.MEUS_APPS_BACKEND_URL}/auth/autenticar-aplicativo/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: sistema?.appKey,
        },
      }
    );

    const usuario = {
      tipo:
        response.data.usuario.aplicativo.tipoAcesso === "master"
          ? "admin"
          : response.data.usuario.aplicativo.tipoAcesso,
      nome: response.data.usuario.nome,
      email: response.data.usuario.email,
    };

    req.usuario = usuario;
    next();
  } catch (error) {
    return Helpers.sendErrorResponse({
      res,
      message: "Token inválido ou erro na autenticação externa.",
      statusCode: 401,
    });
  }
};

module.exports = authMiddleware;
