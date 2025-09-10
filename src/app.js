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
  controleAlteracaoRouter,
  importacaoRouter,
  listaRouter,
  etapaRouter,
} = require("central-oon-core-backend");
const Sistema = require("./models/Sistema");
const getOrigin = async () => (await Sistema.findOne())?.appKey;
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const IntegracaoController = require("./controllers/integracao");
const MoedaController = require("./controllers/moeda");

const app = createApp();

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routers/statusRouter"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", require("./routers/authRouter"));
app.use("/webhooks/", require("./routers/webhookRouter"));
app.use("/ativacao", require("./routers/seedRouter"));
app.use("/tipo-acesso", require("./routers/tipoAcessoRouter"));

app.use(
  "/integracao/processar/ativas",
  asyncHandler(IntegracaoController.processarAtivas)
);

app.use("/integracao/processar", asyncHandler(IntegracaoController.processar));

app.use(
  "/moedas/atualizar-cotacao",
  asyncHandler(MoedaController.atualizarCotacao)
);

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

app.use("/usuarios", require("./routers/usuarioRouter"));
app.use("/pessoas", require("./routers/pessoaRouter"));
app.use("/arquivos", require("./routers/arquivoRouter"));
app.use(
  "/servicos-tomados/tickets",
  require("./routers/servicoTomadoTicketRouter")
);
// app.use("/baseomies", require("./routers/baseOmieRouter"));
// app.use("/aprovacoes", require("./routers/aprovacaoRouter"));
app.use("/etapas", etapaRouter);
// app.use("/esteiras", require("./routers/esteiraRouter"));

// app.use("/logs", require("./routers/logRouter"));
app.use("/servicos", require("./routers/servicoRouter"));
app.use("/documentos-fiscais", require("./routers/documentoFiscalRouter"));
app.use(
  "/documentos-cadastrais",
  require("./routers/documentoCadastralRouter")
);
app.use("/registros", controleAlteracaoRouter);
app.use("/listas", listaRouter);
// app.use("/estados", require("./routers/estadoRouter"));
// app.use("/bancos", require("./routers/bancoRouter"));
app.use("/planejamento", require("./routers/planejamentoRouter"));
app.use("/importacoes", importacaoRouter);
app.use("/dashboard", require("./routers/dashboardRouter"));
app.use("/sistema", require("./routers/sistemaRouter"));
app.use("/lista-omie", require("./routers/listasOmieRouter"));
app.use("/assistentes", require("./routers/assistenteRouter"));
app.use("/integracao", require("./routers/integracaoRouter"));
app.use("/moedas", require("./routers/moedaRouter"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(errorMiddleware);

module.exports = app;
