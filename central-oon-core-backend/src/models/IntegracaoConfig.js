const mongoose = require("mongoose");

module.exports = ({ INTEGRACAO_TIPO, INTEGRACAO_DIRECAO }) => {
  const integracaoConfigSchema = new mongoose.Schema(
    {
      tipo: {
        type: String,
        required: true,
        enum: Object.values(INTEGRACAO_TIPO),
      },
      direcao: {
        type: String,
        required: true,
        enum: Object.values(INTEGRACAO_DIRECAO),
      },
      ativa: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  return (
    mongoose.models.IntegracaoConfig ||
    mongoose.model("IntegracaoConfig", integracaoConfigSchema)
  );
};
