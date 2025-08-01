const mongoose = require("mongoose");

const integracaoSchema = new mongoose.Schema(
  {
    executadoEm: Date,
    titulo: { type: String, required: true },
    tipo: { type: String, required: true, enum: ["pessoa", "conta_pagar"] },
    direcao: {
      type: String,
      required: true,
      enum: ["central_omie", "omie_central"],
    },
    etapa: { type: String, required: true },
    // etapas: [{ nome: String, codigo: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    requisicao: { type: { url: String, body: mongoose.Schema.Types.Mixed } },
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
