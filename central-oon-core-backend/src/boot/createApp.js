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
// (controleAlteracao, importacao, lista, etapa, usuario, sistema, moeda e status)
// are automatically registered on their default paths.
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
    const {
      controleAlteracaoRouter,
      importacaoRouter,
      listaRouter,
      etapaRouter,
      usuarioRouter,
      sistemaRouter,
      moedaRouter,
      statusRouter,
    } = require('../routers');

    routers.push(
      { path: '/', router: statusRouter },
      { path: '/registros', router: controleAlteracaoRouter },
      { path: '/importacoes', router: importacaoRouter },
      { path: '/listas', router: listaRouter },
      { path: '/etapas', router: etapaRouter },
      { path: '/usuarios', router: usuarioRouter },
      { path: '/sistema', router: sistemaRouter },
      { path: '/moedas', router: moedaRouter }
    );
  }

  routers.forEach(({ path = '/', router }) => {
    app.use(path, router);
  });

  return app;
}

module.exports = createApp;
