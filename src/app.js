const express = require("express");
const fs = require("fs");
const path = require("node:path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");

const {
  createApp,
  errorMiddleware,
  GenericError,
  logMiddleware,
  authMiddleware,
  authRouter,
  registrarAcaoMiddleware,
  helpers: { asyncHandler },
  createIntegracaoRouter,
  Sistema,
} = require("central-oon-core-backend");
const getOrigin = async () => (await Sistema.findOne())?.appKey;
const IntegracaoController = require("./controllers/integracao");
const { ACOES, ENTIDADES } = require("./constants/controleAlteracao");

const integracaoRouter = createIntegracaoRouter({
  controller: IntegracaoController,
  registrarAcaoMiddleware,
  ACOES,
  ENTIDADES,
});

const app = createApp({ autoRouters: true });

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routers/statusRouter"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/webhooks/", require("./routers/webhookRouter"));
app.use("/ativacao", require("./routers/seedRouter"));
app.use("/tipo-acesso", require("./routers/tipoAcessoRouter"));

app.use(
  "/integracao/processar/ativas",
  asyncHandler(IntegracaoController.processarAtivas)
);

app.use("/integracao/processar", asyncHandler(IntegracaoController.processar));


app.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "assets/images", filename);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Imagem não encontrada");
  }
});

app.use(authMiddleware({ getOrigin }));
app.use(logMiddleware);
app.use("/pessoas", require("./routers/pessoaRouter"));
app.use("/arquivos", require("./routers/arquivoRouter"));
app.use(
  "/servicos-tomados/tickets",
  require("./routers/servicoTomadoTicketRouter")
);
// app.use("/baseomies", require("./routers/baseOmieRouter"));
// app.use("/aprovacoes", require("./routers/aprovacaoRouter"));
// app.use("/esteiras", require("./routers/esteiraRouter"));

// app.use("/logs", require("./routers/logRouter"));
app.use("/servicos", require("./routers/servicoRouter"));
app.use("/documentos-fiscais", require("./routers/documentoFiscalRouter"));
app.use(
  "/documentos-cadastrais",
  require("./routers/documentoCadastralRouter")
);
// app.use("/estados", require("./routers/estadoRouter"));
// app.use("/bancos", require("./routers/bancoRouter"));
app.use("/planejamento", require("./routers/planejamentoRouter"));
app.use("/dashboard", require("./routers/dashboardRouter"));
app.use("/lista-omie", require("./routers/listasOmieRouter"));
app.use("/assistentes", require("./routers/assistenteRouter"));
app.use("/integracao", integracaoRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(errorMiddleware);

module.exports = app;
