const express = require("express");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../../../../");

const requireFromRoot = (relativePath) => require(path.join(projectRoot, relativePath));

const authMiddleware = requireFromRoot(
  "packages/central-oon-core-backend/src/middlewares/authMiddleware"
);
const logMiddleware = requireFromRoot(
  "packages/central-oon-core-backend/src/middlewares/logMiddleware"
);
const errorMiddleware = requireFromRoot(
  "packages/central-oon-core-backend/src/middlewares/errorMiddleware"
);
const usuarioRouter = requireFromRoot("src/routers/usuarioRouter");
const pessoaRouter = requireFromRoot("src/routers/pessoaRouter");
const arquivoRouter = requireFromRoot("src/routers/arquivoRouter");
const servicoTomadoTicketRouter = requireFromRoot(
  "src/routers/servicoTomadoTicketRouter"
);
const etapaRouter = requireFromRoot("src/routers/etapaRouter");
const servicoRouter = requireFromRoot("src/routers/servicoRouter");
const documentoFiscalRouter = requireFromRoot("src/routers/documentoFiscalRouter");
const documentoCadastralRouter = requireFromRoot(
  "src/routers/documentoCadastralRouter"
);
const controleAlteracaoRouter = requireFromRoot("src/routers/controleAlteracao");
const listaRouter = requireFromRoot("src/routers/listaRouter");
const planejamentoRouter = requireFromRoot("src/routers/planejamentoRouter");
const importacaoRouter = requireFromRoot("src/routers/importacaoRouter");
const dashboardRouter = requireFromRoot("src/routers/dashboardRouter");
const sistemaRouter = requireFromRoot("src/routers/sistemaRouter");
const listasOmieRouter = requireFromRoot("src/routers/listasOmieRouter");
const assistenteRouter = requireFromRoot("src/routers/assistenteRouter");
const integracaoRouter = requireFromRoot("src/routers/integracaoRouter");
const moedaRouter = requireFromRoot("src/routers/moedaRouter");

const registerProtectedRoutes = (app) => {
  app.use(authMiddleware);
  app.use(logMiddleware);

  app.use("/usuarios", usuarioRouter);
  app.use("/pessoas", pessoaRouter);
  app.use("/arquivos", arquivoRouter);
  app.use("/servicos-tomados/tickets", servicoTomadoTicketRouter);
  // app.use("/baseomies", require("./routers/baseOmieRouter"));
  // app.use("/aprovacoes", require("./routers/aprovacaoRouter"));
  app.use("/etapas", etapaRouter);
  // app.use("/esteiras", require("./routers/esteiraRouter"));
  // app.use("/logs", require("./routers/logRouter"));
  app.use("/servicos", servicoRouter);
  app.use("/documentos-fiscais", documentoFiscalRouter);
  app.use("/documentos-cadastrais", documentoCadastralRouter);
  app.use("/registros", controleAlteracaoRouter);
  app.use("/listas", listaRouter);
  // app.use("/estados", require("./routers/estadoRouter"));
  // app.use("/bancos", require("./routers/bancoRouter"));
  app.use("/planejamento", planejamentoRouter);
  app.use("/importacoes", importacaoRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/sistema", sistemaRouter);
  app.use("/lista-omie", listasOmieRouter);
  app.use("/assistentes", assistenteRouter);
  app.use("/integracao", integracaoRouter);
  app.use("/moedas", moedaRouter);

  app.use("/uploads", express.static(path.join(projectRoot, "uploads")));
  app.use(errorMiddleware);
};

module.exports = registerProtectedRoutes;
