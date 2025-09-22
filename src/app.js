const { createApp } = require("../central-oon-core-backend");

const webhookRouter = require("./routers/webhookRouter");
const pessoaRouter = require("./routers/pessoaRouter");
const servicoTomadoTicketRouter = require("./routers/servicoTomadoTicketRouter");
const servicoRouter = require("./routers/servicoRouter");
const documentoFiscalRouter = require("./routers/documentoFiscalRouter");
const documentoCadastralRouter = require("./routers/documentoCadastralRouter");
const planejamentoRouter = require("./routers/planejamentoRouter");
const dashboardRouter = require("./routers/dashboardRouter");
const listasOmieRouter = require("./routers/listasOmieRouter");

const registerPublicRoutes = (app) => {
  app.use("/webhooks/", webhookRouter);
};

const registerPrivateRoutes = (app) => {
  app.use("/pessoas", pessoaRouter);
  app.use("/servicos-tomados/tickets", servicoTomadoTicketRouter);
  app.use("/servicos", servicoRouter);
  app.use("/documentos-fiscais", documentoFiscalRouter,);
  app.use("/documentos-cadastrais", documentoCadastralRouter,);
  app.use("/planejamento", planejamentoRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/listas-omie", listasOmieRouter);
};

module.exports = createApp({
  registerPublicRoutes,
  registerPrivateRoutes,
});
