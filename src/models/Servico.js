const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema(
  {
    tipoServicoTomado: String,
    descricao: String,
    valorMoeda: Number,
    cotacao: Number,
    moeda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moeda",
      required: [true],
    },
    pessoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pessoa",
      required: [true],
    },
    dataContratacao: Date,
    dataConclusao: Date,
    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },
    statusProcessamento: {
      type: String,
      enum: ["aberto", "pendente", "processando", "pago", "pago-externo"],
      default: "aberto",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Servico", servicoSchema);
