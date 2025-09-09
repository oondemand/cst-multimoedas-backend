const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("node:path");

function createServer({ routers = [] } = {}) {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(express.static(path.join(process.cwd(), "public")));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  routers.forEach(({ path, router }) => {
    app.use(path, router);
  });

  const PORT = process.env.PORT || 4000;
  const SERVICE_NAME = process.env.SERVICE_NAME || "server";

  app.listen(PORT, () => {
    console.log("****************************************************************");
    console.log(`${SERVICE_NAME} rodando na porta ${PORT}`);
    console.log("****************************************************************");
    console.log("");
  });

  return app;
}

module.exports = createServer;
