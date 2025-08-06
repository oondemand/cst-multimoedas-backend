const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema(
  {
    tipoServicoTomado: String,
    descricao: String,
    valor: Number,
    valorMoeda: Number,
    moeda: String,
    pessoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pessoa",
      required: [true, "Pessoa é obrigatório"],
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
    virtuals: true,
  }
);

servicoSchema.virtual("valorTotal").get(function () {
  return this.valor * (this?.valorMoeda ?? 1);
});

module.exports = mongoose.model("Servico", servicoSchema);
