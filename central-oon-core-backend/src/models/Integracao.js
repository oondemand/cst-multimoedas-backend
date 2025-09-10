const mongoose = require("mongoose");
const {
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
} = require("../constants/integracao");

const integracaoSchema = new mongoose.Schema(
  {
    executadoEm: Date,
    titulo: { type: String, required: true },
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

module.exports = mongoose.model("Integracao", integracaoSchema);
