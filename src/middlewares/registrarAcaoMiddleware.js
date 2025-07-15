const { ORIGENS } = require("../constants/controleAlteracao");
const { registrarAcao } = require("../services/controleService");

function registrarAcaoMiddleware({ entidade, acao }) {
  return async (req, res, next) => {
    const origem = req.headers["x-origem"] ?? ORIGENS.API;

    const originalJson = res.json;
    let responseBody;

    res.json = function (body) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    res.on("finish", () => {
      const { message, ...rest } = responseBody || {};
      const registradoAlterado = rest[Object.keys(rest)?.[0]];

      console.log("REQ.usuario", req.usuario.nome);

      if (res.statusCode < 400) {
        registrarAcao({
          entidade,
          acao,
          origem,
          usuario: {
            nome: req?.usuario?.nome,
            email: req?.usuario?.email,
          },
          idRegistro: registradoAlterado?._id,
          dadosAtualizados: registradoAlterado,
        });
      }
    });

    next();
  };
}

module.exports = { registrarAcaoMiddleware };
