const { createIntegracaoModel } = require("central-oon-core-backend");
const { INTEGRACAO_TIPO, INTEGRACAO_DIRECAO } = require("../constants/integracao");

module.exports = createIntegracaoModel({
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
});
