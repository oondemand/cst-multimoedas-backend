const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("node:path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../src/docs/swagger");

dotenv.config();

const {
  authMiddleware,
  logMiddleware,
  errorMiddleware,
} = require("./middlewares");
const { asyncHandler } = require("./utils/helpers");
const IntegracaoController = require("../src/controllers/integracao");
const MoedaController = require("../src/controllers/moeda");

const DEFAULT_REQUEST_LIMIT = "10mb";
const DEFAULT_PUBLIC_DIR = path.join(__dirname, "..", "src", "public");
const DEFAULT_ASSETS_DIR = path.join(
  __dirname,
  "..",
  "src",
  "assets",
  "images",
);
const DEFAULT_UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const createApp = ({
  corsOptions = { origin: "*" },
  helmetOptions,
  requestLimit = DEFAULT_REQUEST_LIMIT,
  publicDir = DEFAULT_PUBLIC_DIR,
  assetsDir = DEFAULT_ASSETS_DIR,
  uploadsDir = DEFAULT_UPLOADS_DIR,
  registerPublicRoutes,
  registerPrivateRoutes,
} = {}) => {
  const app = express();

  app.use(cors(corsOptions));
  app.use(helmet(helmetOptions));
  app.use(express.json({ limit: requestLimit }));
  app.use(express.urlencoded({ extended: true, limit: requestLimit }));

  if (publicDir) {
    app.use(express.static(publicDir));
  }

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/", require("../src/routers/statusRouter"));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/auth", require("../src/routers/authRouter"));
  app.use("/ativacao", require("../src/routers/seedRouter"));
  app.use("/tipo-acesso", require("../src/routers/tipoAcessoRouter"));

  if (typeof registerPublicRoutes === "function") {
    registerPublicRoutes(app);
  }

  app.use(
    "/integracao/processar/ativas",
    asyncHandler(IntegracaoController.processarAtivas),
  );

  app.use(
    "/integracao/processar",
    asyncHandler(IntegracaoController.processar),
  );

  app.use(
    "/moedas/atualizar-cotacao",
    asyncHandler(MoedaController.atualizarCotacao),
  );

  if (assetsDir) {
    app.get("/image/:filename", (req, res) => {
      const filename = req.params.filename;
      const imagePath = path.join(assetsDir, filename);

      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(404).send("Imagem não encontrada");
      }
    });
  }

  app.use(authMiddleware);
  app.use(logMiddleware);

  app.use("/usuarios", require("../src/routers/usuarioRouter"));
  app.use("/arquivos", require("../src/routers/arquivoRouter"));
  // app.use("/baseomies", require("../src/routers/baseOmieRouter"));
  // app.use("/aprovacoes", require("../src/routers/aprovacaoRouter"));
  app.use("/etapas", require("../src/routers/etapaRouter"));
  // app.use("/esteiras", require("../src/routers/esteiraRouter"));

  // app.use("/logs", require("../src/routers/logRouter"));
  app.use("/registros", require("../src/routers/controleAlteracao"));
  app.use("/listas", require("../src/routers/listaRouter"));
  // app.use("/estados", require("../src/routers/estadoRouter"));
  // app.use("/bancos", require("../src/routers/bancoRouter"));
  app.use("/importacoes", require("../src/routers/importacaoRouter"));
  app.use("/sistema", require("../src/routers/sistemaRouter"));
  app.use("/assistentes", require("../src/routers/assistenteRouter"));
  app.use("/integracao", require("../src/routers/integracaoRouter"));
  app.use("/moedas", require("../src/routers/moedaRouter"));

  if (typeof registerPrivateRoutes === "function") {
    registerPrivateRoutes(app);
  }

  if (uploadsDir) {
    app.use("/uploads", express.static(uploadsDir));
  }

  app.use(errorMiddleware);

  return app;
};

module.exports = { createApp };
