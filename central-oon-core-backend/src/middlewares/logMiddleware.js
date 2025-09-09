const Log = require('../models/Log');

const logMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }

  const usuarioId = req.usuario ? req.usuario.id : null;
  const endpoint = req.originalUrl;
  const metodo = req.method;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const dadosRequisicao = req.body;

  const log = new Log({
    usuario: usuarioId,
    endpoint,
    metodo,
    ip,
    dadosRequisicao,
  });

  res.on('finish', () => {
    log.statusResposta = res.statusCode;
    log.dadosResposta = res.locals.body || null;

    log.save();
  });

  next();
};

module.exports = logMiddleware;
