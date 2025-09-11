const mongoose = require("mongoose");

module.exports = ({ INTEGRACAO_TIPO, INTEGRACAO_DIRECAO }) => {
  const integracaoSchema = new mongoose.Schema(
    {
      executadoEm: Date,
      titulo: { type: String, required: true },
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
    { timestamps: true }
  );

  return (
    mongoose.models.Integracao ||
    mongoose.model("Integracao", integracaoSchema)
  );
};
