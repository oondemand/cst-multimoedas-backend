const mongoose = require("mongoose");
const { resolveEnumValues } = require("./utils");

const createIntegracaoModel = ({ integracao = {} } = {}) => {
  if (mongoose.models.Integracao) {
    return mongoose.models.Integracao;
  }

  const { tipos, direcoes } = integracao;

  const integracaoSchema = new mongoose.Schema(
    {
      executadoEm: Date,
      titulo: { type: String, required: true },
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
      etapa: { type: String, required: true },
      parentId: { type: mongoose.Schema.Types.ObjectId },
      externalId: String,
      requisicao: {
        type: {
          url: { type: String, default: "" },
          body: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
      },
      resposta: mongoose.Schema.Types.Mixed,
      erros: { type: [mongoose.Schema.Types.Mixed], default: [] },
      tentativas: { type: Number, default: 0 },
      payload: mongoose.Schema.Types.Mixed,
      arquivado: { type: Boolean, default: false },
      motivoArquivamento: {
        type: String,
        enum: ["Duplicidade", "Solicitado pelo usuário"],
      },
    },
    { timestamps: true },
  );

  return mongoose.model("Integracao", integracaoSchema);
};

module.exports = createIntegracaoModel;
