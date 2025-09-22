const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const isValidMiddleware = (middleware) =>
  typeof middleware === "function" ||
  Array.isArray(middleware) ||
  (middleware && typeof middleware === "object" && "path" in middleware);

const createCoreApp = ({ middlewares = [], modules = [] } = {}) => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  middlewares.forEach((middleware) => {
    if (!middleware) return;
    if (!isValidMiddleware(middleware)) {
      throw new Error("Invalid middleware received by createCoreApp");
    }

    if (Array.isArray(middleware)) {
      app.use(...middleware);
      return;
    }

    if (typeof middleware === "function") {
      app.use(middleware);
      return;
    }

    if (middleware.path && middleware.handler) {
      app.use(middleware.path, middleware.handler);
      return;
    }

    if (middleware.path && middleware.middleware) {
      app.use(middleware.path, middleware.middleware);
    }
  });

  modules.forEach((registeredModule) => {
    if (!registeredModule) return;

    if (typeof registeredModule === "function") {
      registeredModule(app);
      return;
    }

    if (registeredModule.path && registeredModule.router) {
      app.use(registeredModule.path, registeredModule.router);
      return;
    }

    if (
      registeredModule.register &&
      typeof registeredModule.register === "function"
    ) {
      registeredModule.register(app);
    }
  });

  return app;
};

module.exports = { createCoreApp };
