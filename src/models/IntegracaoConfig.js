const mongoose = require("mongoose");
const {
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
} = require("../constants/integracao");

const integracaoConfigSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: Object.entries(INTEGRACAO_TIPO).map(([key, value]) => value),
    },
    direcao: {
      type: String,
      required: true,
      enum: Object.entries(INTEGRACAO_DIRECAO).map(([key, value]) => value),
    },
    ativa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IntegracaoConfig", integracaoConfigSchema);
