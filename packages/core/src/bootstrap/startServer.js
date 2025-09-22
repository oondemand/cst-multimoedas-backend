const connectDB = require("../../../central-oon-core-backend/src/config/db");

const getServerConfiguration = ({ port, serviceName } = {}) => ({
  port: port || process.env.PORT || 4000,
  serviceName: serviceName || process.env.SERVICE_NAME || "Core Service",
});

const startCoreServer = async (app, options = {}) => {
  if (!app) {
    throw new Error("startCoreServer requires an Express application instance");
  }

  const { port, serviceName } = getServerConfiguration(options);

  try {
    console.log("Testando conexão com o Banco de Dados...");
    await connectDB();

    app.listen(port, () => {
      console.log(
        "****************************************************************"
      );
      console.log(`${serviceName} rodando na porta ${port} e conectado ao MongoDB`);
      console.log(
        "****************************************************************"
      );
      console.log("");
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

module.exports = { startCoreServer };
