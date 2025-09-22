const fs = require("fs");
const path = require("node:path");
const swaggerUi = require("swagger-ui-express");

const projectRoot = path.resolve(__dirname, "../../../../");

const requireFromRoot = (relativePath) => require(path.join(projectRoot, relativePath));

const swaggerDocument = requireFromRoot("src/docs/swagger");
const { asyncHandler } = requireFromRoot(
  "packages/central-oon-core-backend/src/utils/helpers"
);
const IntegracaoController = requireFromRoot("src/controllers/integracao");
const MoedaController = requireFromRoot("src/controllers/moeda");
const statusRouter = requireFromRoot("src/routers/statusRouter");
const authRouter = requireFromRoot("src/routers/authRouter");
const webhookRouter = requireFromRoot("src/routers/webhookRouter");
const seedRouter = requireFromRoot("src/routers/seedRouter");
const tipoAcessoRouter = requireFromRoot("src/routers/tipoAcessoRouter");

const registerPublicRoutes = (app) => {
  app.use("/", statusRouter);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/auth", authRouter);
  app.use("/webhooks/", webhookRouter);
  app.use("/ativacao", seedRouter);
  app.use("/tipo-acesso", tipoAcessoRouter);

  app.use(
    "/integracao/processar/ativas",
    asyncHandler(IntegracaoController.processarAtivas)
  );

  app.use(
    "/integracao/processar",
    asyncHandler(IntegracaoController.processar)
  );

  app.use(
    "/moedas/atualizar-cotacao",
    asyncHandler(MoedaController.atualizarCotacao)
  );

  app.get("/image/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(projectRoot, "src/assets/images", filename);

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Imagem não encontrada");
    }
  });
};

module.exports = registerPublicRoutes;
