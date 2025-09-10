const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Loads environment variables and returns a configured Express application
//
// @param {Object} [options]
// @param {Array} [options.middlewares] - Additional middlewares to load.
// @param {Array<{path: string, router: import('express').Router}>} [options.routers] - Routers to register.
// @param {boolean} [options.autoRouters=true] - When true, core routers
// (controleAlteracao, importacao, lista and etapa) are automatically
// registered on their default paths.
function createApp({ middlewares = [], routers = [], autoRouters = true } = {}) {
  dotenv.config();

  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  middlewares.forEach((mw) => app.use(mw));

  if (autoRouters) {
    const controleAlteracaoRouter = require('../routers/controleAlteracaoRouter');
    const importacaoRouter = require('../routers/importacaoRouter');
    const listaRouter = require('../routers/listaRouter');
    const etapaRouter = require('../routers/etapaRouter');

    routers.push(
      { path: '/registros', router: controleAlteracaoRouter },
      { path: '/importacoes', router: importacaoRouter },
      { path: '/listas', router: listaRouter },
      { path: '/etapas', router: etapaRouter }
    );
  }

  routers.forEach(({ path = '/', router }) => {
    app.use(path, router);
  });

  return app;
}

module.exports = createApp;
