const { createCoreApp, startCoreServer } = require("../../../packages/core/src");

const registerPublicRoutes = require("./modules/publicRoutes");
const registerProtectedRoutes = require("./modules/protectedRoutes");

const app = createCoreApp({
  modules: [registerPublicRoutes, registerProtectedRoutes],
});

startCoreServer(app, {
  port: process.env.MULTIMOEDAS_PORT,
  serviceName: process.env.MULTIMOEDAS_SERVICE_NAME,
});

module.exports = app;
