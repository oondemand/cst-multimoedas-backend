const mongoose = require("mongoose");
const { resolveEnumValues } = require("./utils");

const createIntegracaoConfigModel = ({ integracao = {} } = {}) => {
  if (mongoose.models.IntegracaoConfig) {
    return mongoose.models.IntegracaoConfig;
  }

  const { tipos, direcoes } = integracao;

  const integracaoConfigSchema = new mongoose.Schema(
    {
      tipo: {
        type: String,
        required: true,
        enum: resolveEnumValues(tipos),
      },
      direcao: {
        type: String,
        required: true,
        enum: resolveEnumValues(direcoes),
      },
      ativa: { type: Boolean, default: true },
    },
    { timestamps: true },
  );

  return mongoose.model("IntegracaoConfig", integracaoConfigSchema);
};

module.exports = createIntegracaoConfigModel;
