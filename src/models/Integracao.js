const mongoose = require("mongoose");

const requisicaoSchema = new mongoose.Schema({
  url: String,
  body: mongoose.Schema.Types.Mixed,
});

const integracaoSchema = new mongoose.Schema({
  executado: Date,
  tipo: { type: String, enum: ["pessoa", "conta_pagar"] },
  direcao: { type: String, enum: ["central_omie", "omie_central"] },
  parentId: mongoose.Schema.Types.ObjectId,
  tentativas: { type: Number, default: 0 },
  requisicao: requisicaoSchema,
  resposta: mongoose.Schema.Types.Mixed,
  erros: mongoose.Schema.Types.Mixed,
  payload: mongoose.Schema.Types.Mixed,
  arquivado: { type: Boolean, default: false },
  motivoArquivamento: {
    type: String,
    enum: ["Duplicidade", "Solicitado pelo usuário"],
  },
});

module.exports = mongoose.model("Integracao", integracaoSchema);
