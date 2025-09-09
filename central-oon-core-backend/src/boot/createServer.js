const connectDB = require('../config/db');

function createServer(
  app,
  { port = process.env.PORT || 4000, serviceName = process.env.SERVICE_NAME } = {}
) {
  const startServer = async () => {
    try {
      console.log('Testando conexão com o Banco de Dados...');
      await connectDB();

      app.listen(port, () => {
        console.log('****************************************************************');
        console.log(`${serviceName} rodando na porta ${port} e conectado ao MongoDB`);
        console.log('****************************************************************');
        console.log('');
      });
    } catch (error) {
      console.error('Falha ao iniciar o servidor:', error);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = createServer;
