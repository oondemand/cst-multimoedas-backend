const resolvePort = (port) => port ?? process.env.PORT ?? 4000;
const resolveServiceName = (serviceName) =>
  serviceName ?? process.env.SERVICE_NAME ?? "Aplicação";

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

const startServer = async ({
  app,
  connectDB,
  port,
  serviceName,
  logger = console,
  exitOnError = true,
} = {}) => {
  assertRequiredDependencies(app, connectDB);

  const resolvedPort = resolvePort(port);
  const resolvedServiceName = resolveServiceName(serviceName);

  try {
    logger.log("Testando conexão com o Banco de Dados...");
    await connectDB();

    const server = app.listen(resolvedPort, () => {
      logger.log("****************************************************************");
      logger.log(
        `${resolvedServiceName} rodando na porta ${resolvedPort} e conectado ao MongoDB`,
      );
      logger.log("****************************************************************");
      logger.log("");
    });

    return server;
  } catch (error) {
    logger.error("Falha ao iniciar o servidor:", error);

    if (exitOnError) {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = { startServer };
