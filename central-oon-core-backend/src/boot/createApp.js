const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Loads environment variables and returns a configured Express application
function createApp({ middlewares = [], routers = [] } = {}) {
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

  routers.forEach(({ path = '/', router }) => {
    app.use(path, router);
  });

  return app;
}

module.exports = createApp;
