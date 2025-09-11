const { createIntegracaoConfigModel } = require("central-oon-core-backend");
const { INTEGRACAO_TIPO, INTEGRACAO_DIRECAO } = require("../constants/integracao");

module.exports = createIntegracaoConfigModel({
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
});
