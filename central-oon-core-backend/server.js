const config = require("./config");

const resolvePort = (port) => port ?? process.env.PORT ?? 4000;
const resolveServiceName = (serviceName) =>
  serviceName ?? process.env.SERVICE_NAME ?? "Aplicação";

const getLoggerMethod = (logger, method, fallbackMethod = "log") => {
  if (logger && typeof logger[method] === "function") {
    return logger[method].bind(logger);
  }

  if (logger && typeof logger[fallbackMethod] === "function") {
    return logger[fallbackMethod].bind(logger);
  }

  if (typeof console[method] === "function") {
    return console[method].bind(console);
  }

  return console.log.bind(console);
};

const assertRequiredDependencies = (app, connectDB) => {
  if (!app) {
    throw new Error("Uma instância do Express deve ser fornecida para iniciar o servidor.");
  }

  if (typeof connectDB !== "function") {
    throw new Error(
      "Uma função de conexão com o banco de dados deve ser fornecida para iniciar o servidor.",
    );
  }
};

const { db: dbConfig, logger: loggerConfig } = config;

const defaultConnectDB = dbConfig?.connectDB;
const defaultLogger = loggerConfig?.logger ?? console;

const startServer = async ({
  app,
  connectDB = defaultConnectDB,
  port,
  serviceName,
  logger = defaultLogger,
  exitOnError = true,
} = {}) => {
  assertRequiredDependencies(app, connectDB);

  const resolvedPort = resolvePort(port);
  const resolvedServiceName = resolveServiceName(serviceName);

  const logInfo = getLoggerMethod(logger, "info");
  const logError = getLoggerMethod(logger, "error");

  try {
    logInfo("Testando conexão com o Banco de Dados...");
    await connectDB();

    const server = app.listen(resolvedPort, () => {
      logInfo("");
      logInfo("************************************************************************",);
      logInfo(`${resolvedServiceName} rodando na porta ${resolvedPort} e conectado ao MongoDB`,);
      logInfo("************************************************************************",);
      logInfo("");
    });

    return server;
  } catch (error) {
    logError("Falha ao iniciar o servidor:", error);

    if (exitOnError) {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = { startServer };
