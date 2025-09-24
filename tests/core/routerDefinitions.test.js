const routersUnderTest = [
  {
    name: "status",
    router: require("../../src/routers/statusRouter"),
    expectedRoutes: [{ path: "/", methods: ["get"] }],
  },
  {
    name: "auth",
    router: require("../../src/routers/authRouter"),
    expectedRoutes: [
      { path: "/login", methods: ["post"] },
      { path: "/validar-token", methods: ["get"] },
      { path: "/esqueci-minha-senha", methods: ["post"] },
      { path: "/alterar-senha", methods: ["post"] },
    ],
  },
  {
    name: "ativacao",
    router: require("../../src/routers/seedRouter"),
    expectedRoutes: [{ path: "/", methods: ["post"] }],
  },
  {
    name: "tipo-acesso",
    router: require("../../src/routers/tipoAcessoRouter"),
    expectedRoutes: [{ path: "/", methods: ["get"] }],
  },
  {
    name: "usuarios",
    router: require("../../src/routers/usuarioRouter"),
    expectedRoutes: [
      { path: "/", methods: ["get"] },
      { path: "/", methods: ["post"] },
      { path: "/:id", methods: ["get"] },
      { path: "/:id", methods: ["put"] },
      { path: "/:id", methods: ["delete"] },
      { path: "/esqueci-minha-senha", methods: ["post"] },
    ],
  },
  {
    name: "arquivos",
    router: require("../../src/routers/arquivoRouter"),
    expectedRoutes: [{ path: "/:id", methods: ["get"] }],
  },
  {
    name: "etapas",
    router: require("../../src/routers/etapaRouter"),
    expectedRoutes: [
      { path: "/", methods: ["post"] },
      { path: "/ativas/:esteira", methods: ["get"] },
      { path: "/", methods: ["get"] },
      { path: "/:id", methods: ["put"] },
      { path: "/:id", methods: ["delete"] },
    ],
  },
  {
    name: "controle-alteracao",
    router: require("../../src/routers/controleAlteracao"),
    expectedRoutes: [{ path: "/", methods: ["get"] }],
  },
  {
    name: "listas",
    router: require("../../src/routers/listaRouter"),
    expectedRoutes: [
      { path: "/", methods: ["post"] },
      { path: "/", methods: ["get"] },
      { path: "/codigos", methods: ["get"] },
      { path: "/:codigo", methods: ["get"] },
      { path: "/:codigo/", methods: ["post"] },
      { path: "/:codigo/:itemId", methods: ["delete"] },
      { path: "/:codigo", methods: ["put"] },
    ],
  },
  {
    name: "importacoes",
    router: require("../../src/routers/importacaoRouter"),
    expectedRoutes: [{ path: "/", methods: ["get"] }],
  },
  {
    name: "sistema",
    router: require("../../src/routers/sistemaRouter"),
    expectedRoutes: [
      { path: "/", methods: ["get"] },
      { path: "/:id", methods: ["put"] },
      { path: "/teste-email", methods: ["post"] },
    ],
  },
  {
    name: "assistentes",
    router: require("../../src/routers/assistenteRouter"),
    expectedRoutes: [
      { path: "/", methods: ["post"] },
      { path: "/", methods: ["get"] },
      { path: "/ativos", methods: ["get"] },
      { path: "/:id", methods: ["get"] },
      { path: "/:id", methods: ["put"] },
      { path: "/:id", methods: ["delete"] },
    ],
  },
  {
    name: "integracao",
    router: require("../../src/routers/integracaoRouter"),
    expectedRoutes: [
      { path: "/", methods: ["get"] },
      { path: "/todos", methods: ["get"] },
      { path: "/reprocessar/:id", methods: ["post"] },
      { path: "/arquivar/:id", methods: ["post"] },
      { path: "/config", methods: ["get"] },
      { path: "/config/:id", methods: ["put"] },
    ],
  },
  {
    name: "moedas",
    router: require("../../src/routers/moedaRouter"),
    expectedRoutes: [
      { path: "/", methods: ["get"] },
      { path: "/ativas", methods: ["get"] },
    ],
  },
];

const extractRoutes = (router) =>
  router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.entries(layer.route.methods)
        .filter(([, enabled]) => enabled)
        .map(([method]) => method)
        .sort(),
    }));

const assertRouteExists = (routes, path, method) => {
  expect(routes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path,
        methods: expect.arrayContaining([method]),
      }),
    ]),
  );
};

routersUnderTest.forEach(({ name, router, expectedRoutes }) => {
  describe(`${name} router`, () => {
    const routes = extractRoutes(router);

    test("should expose at least one route", () => {
      expect(routes.length).toBeGreaterThan(0);
    });

    expectedRoutes.forEach(({ path, methods }) => {
      test(`should register ${methods.join(",")} ${path}`, () => {
        methods.forEach((method) => {
          assertRouteExists(routes, path, method);
        });
      });
    });
  });
});
