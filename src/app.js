const { createApp } = require("../central-oon-core-backend");

const registerPublicRoutes = (app) => {
  app.use("/webhooks/", require("./routers/webhookRouter"));
};

const registerPrivateRoutes = (app) => {
  app.use("/pessoas", require("./routers/pessoaRouter"));
  app.use(
    "/servicos-tomados/tickets",
    require("./routers/servicoTomadoTicketRouter"),
  );
  app.use("/servicos", require("./routers/servicoRouter"));
  app.use(
    "/documentos-fiscais",
    require("./routers/documentoFiscalRouter"),
  );
  app.use(
    "/documentos-cadastrais",
    require("./routers/documentoCadastralRouter"),
  );
  app.use("/planejamento", require("./routers/planejamentoRouter"));
  app.use("/dashboard", require("./routers/dashboardRouter"));
};

module.exports = createApp({
  registerPublicRoutes,
  registerPrivateRoutes,
});
