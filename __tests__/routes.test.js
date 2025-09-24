const passthrough = (req, res, next) => next();
const passthroughError = (err, req, res, next) => next(err);

jest.mock("../central-oon-core-backend", () => ({
  middlewares: {
    registrarAcaoMiddleware: () => passthrough,
    authMiddleware: passthrough,
    logMiddleware: passthrough,
    errorMiddleware: passthroughError,
  },
  config: {
    multer: {
      uploadExcel: {
        array: () => passthrough,
        single: () => passthrough,
      },
      uploadPDFAndImage: {
        array: () => passthrough,
        single: () => passthrough,
      },
    },
  },
}));

jest.mock(
  "../src/controllers/logController",
  () => ({
    listarTodosLogs: jest.fn(),
    listarLogsPorUsuario: jest.fn(),
    filtrarLogs: jest.fn(),
    excluirTodosLogs: jest.fn(),
  }),
  { virtual: true }
);

const extractRoutes = (router) =>
  router.stack
    .filter((layer) => layer.route)
    .flatMap((layer) => {
      const { path } = layer.route;
      return Object.keys(layer.route.methods)
        .filter((method) => layer.route.methods[method])
        .map((method) => ({ method, path }));
    });

const route = (method, path) => ({ method, path });

const ROUTE_TEST_CASES = [
  {
    name: "arquivoRouter",
    modulePath: "../src/routers/arquivoRouter",
    expectedRoutes: [route("get", "/:id")],
  },
  {
    name: "assistenteRouter",
    modulePath: "../src/routers/assistenteRouter",
    expectedRoutes: [
      route("post", "/"),
      route("get", "/"),
      route("get", "/ativos"),
      route("get", "/:id"),
      route("put", "/:id"),
      route("delete", "/:id"),
    ],
  },
  {
    name: "authRouter",
    modulePath: "../src/routers/authRouter",
    expectedRoutes: [
      route("post", "/login"),
      route("get", "/validar-token"),
      route("post", "/esqueci-minha-senha"),
      route("post", "/alterar-senha"),
    ],
  },
  {
    name: "controleAlteracao",
    modulePath: "../src/routers/controleAlteracao",
    expectedRoutes: [route("get", "/")],
  },
  {
    name: "dashboardRouter",
    modulePath: "../src/routers/dashboardRouter",
    expectedRoutes: [route("get", "/estatisticas")],
  },
  {
    name: "documentoCadastralRouter",
    modulePath: "../src/routers/documentoCadastralRouter",
    expectedRoutes: [
      route("get", "/"),
      route("get", "/exportar"),
      route("post", "/importar"),
      route("get", "/pessoa/:pessoaId"),
      route("delete", "/:id"),
      route("post", "/"),
      route("post", "/anexar-arquivo/:documentoCadastralId"),
      route("delete", "/excluir-arquivo/:documentoCadastralId/:id"),
      route("patch", "/:id"),
      route("post", "/aprovar-documento/:id"),
      route("post", "/reprovar-documento/:id"),
    ],
  },
  {
    name: "documentoFiscalRouter",
    modulePath: "../src/routers/documentoFiscalRouter",
    expectedRoutes: [
      route("get", "/"),
      route("get", "/exportar"),
      route("post", "/importar"),
      route("get", "/pessoa/:pessoaId"),
      route("delete", "/:id"),
      route("post", "/"),
      route("post", "/anexar-arquivo/:documentoFiscalId"),
      route("delete", "/excluir-arquivo/:documentoFiscalId/:id"),
      route("patch", "/:id"),
      route("post", "/aprovar-documento/:id"),
      route("post", "/reprovar-documento/:id"),
    ],
  },
  {
    name: "etapaRouter",
    modulePath: "../src/routers/etapaRouter",
    expectedRoutes: [
      route("post", "/"),
      route("get", "/ativas/:esteira"),
      route("get", "/"),
      route("put", "/:id"),
      route("delete", "/:id"),
    ],
  },
  {
    name: "importacaoRouter",
    modulePath: "../src/routers/importacaoRouter",
    expectedRoutes: [route("get", "/")],
  },
  {
    name: "integracaoRouter",
    modulePath: "../src/routers/integracaoRouter",
    expectedRoutes: [
      route("get", "/"),
      route("get", "/todos"),
      route("post", "/reprocessar/:id"),
      route("post", "/arquivar/:id"),
      route("get", "/config"),
      route("put", "/config/:id"),
    ],
  },
  {
    name: "listaOmieRouter",
    modulePath: "../src/routers/listaOmieRouter",
    expectedRoutes: [
      route("post", "/"),
      route("get", "/"),
      route("get", "/:codigo"),
      route("delete", "/:id"),
      route("put", "/:id"),
      route("put", "/sync-omie/:id"),
    ],
  },
  {
    name: "listaRouter",
    modulePath: "../src/routers/listaRouter",
    expectedRoutes: [
      route("post", "/"),
      route("get", "/"),
      route("get", "/codigos"),
      route("get", "/:codigo"),
      route("post", "/:codigo/"),
      route("delete", "/:codigo/:itemId"),
      route("put", "/:codigo"),
    ],
  },
  {
    name: "logRouter",
    modulePath: "../src/routers/logRouter",
    expectedRoutes: [
      route("get", "/"),
      route("get", "/usuario/:usuarioId"),
      route("get", "/filtrar"),
      route("post", "/excluir-todos"),
    ],
  },
  {
    name: "moedaRouter",
    modulePath: "../src/routers/moedaRouter",
    expectedRoutes: [route("get", "/"), route("get", "/ativas")],
  },
  {
    name: "pessoaRouter",
    modulePath: "../src/routers/pessoaRouter",
    expectedRoutes: [
      route("get", "/"),
      route("post", "/"),
      route("get", "/exportar"),
      route("get", "/:id"),
      route("patch", "/:id"),
      route("delete", "/:id"),
      route("post", "/importar"),
    ],
  },
  {
    name: "planejamentoRouter",
    modulePath: "../src/routers/planejamentoRouter",
    expectedRoutes: [
      route("get", "/listar-servicos"),
      route("get", "/estatisticas"),
      route("post", "/processar-servicos"),
      route("post", "/processar-servico/:id"),
      route("post", "/sincronizar-esteira"),
    ],
  },
  {
    name: "seedRouter",
    modulePath: "../src/routers/seedRouter",
    expectedRoutes: [route("post", "/")],
  },
  {
    name: "servicoRouter",
    modulePath: "../src/routers/servicoRouter",
    expectedRoutes: [
      route("get", "/"),
      route("post", "/"),
      route("get", "/exportar"),
      route("patch", "/:id"),
      route("delete", "/:id"),
      route("post", "/importar"),
      route("get", "/pessoa/:pessoaId"),
    ],
  },
  {
    name: "servicoTomadoTicketRouter",
    modulePath: "../src/routers/servicoTomadoTicketRouter",
    expectedRoutes: [
      route("post", "/:id/upload"),
      route("delete", "/arquivo/:ticketId/:id"),
      route("post", "/"),
      route("get", "/"),
      route("get", "/arquivados"),
      route("post", "/arquivar/:id"),
      route("patch", "/:id"),
      route("post", "/:id/aprovar"),
      route("post", "/:id/reprovar"),
      route("post", "/adicionar-servico/:ticketId/:servicoId/"),
      route("post", "/remover-servico/:servicoId"),
      route(
        "post",
        "/adicionar-documento-fiscal/:ticketId/:documentoFiscalId/"
      ),
      route("post", "/remover-documento-fiscal/:documentoFiscalId"),
      route("get", "/:id"),
    ],
  },
  {
    name: "sistemaRouter",
    modulePath: "../src/routers/sistemaRouter",
    expectedRoutes: [
      route("get", "/"),
      route("put", "/:id"),
      route("post", "/teste-email"),
    ],
  },
  {
    name: "statusRouter",
    modulePath: "../src/routers/statusRouter",
    expectedRoutes: [route("get", "/")],
  },
  {
    name: "tipoAcessoRouter",
    modulePath: "../src/routers/tipoAcessoRouter",
    expectedRoutes: [route("get", "/")],
  },
  {
    name: "usuarioRouter",
    modulePath: "../src/routers/usuarioRouter",
    expectedRoutes: [
      route("get", "/"),
      route("post", "/"),
      route("get", "/:id"),
      route("put", "/:id"),
      route("delete", "/:id"),
      route("post", "/esqueci-minha-senha"),
    ],
  },
  {
    name: "webhookRouter",
    modulePath: "../src/routers/webhookRouter",
    expectedRoutes: [
      route("post", "/pessoa"),
      route("post", "/conta-pagar"),
    ],
  },
];

describe("Definição das rotas da aplicação", () => {
  test.each(ROUTE_TEST_CASES)(
    "$name expõe as rotas esperadas",
    ({ modulePath, expectedRoutes }) => {
      jest.isolateModules(() => {
        const router = require(modulePath);
        const registeredRoutes = extractRoutes(router);

        expectedRoutes.forEach(({ method, path }) => {
          const exists = registeredRoutes.some(
            (routeConfig) =>
              routeConfig.path === path && routeConfig.method === method
          );

          expect(exists).toBe(true);
        });
      });
    }
  );
});
