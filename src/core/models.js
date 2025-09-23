const {
  models,
  configureModels,
} = require("../../central-oon-core-backend/models");
const {
  ENTIDADES,
  ACOES,
  ORIGENS,
} = require("../constants/controleAlteracao");
const {
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
} = require("../constants/integracao");
const { LISTAS } = require("../constants/listas");

configureModels({
  controleAlteracao: {
    entidades: Object.values(ENTIDADES || {}),
    acoes: Object.values(ACOES || {}),
    origens: Object.values(ORIGENS || {}),
  },
  integracao: {
    tipos: Object.values(INTEGRACAO_TIPO || {}),
    direcoes: Object.values(INTEGRACAO_DIRECAO || {}),
  },
  lista: {
    codigos: Array.isArray(LISTAS) ? LISTAS : [],
  },
});

module.exports = models;
