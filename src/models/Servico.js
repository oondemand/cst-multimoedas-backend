const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema(
  {
    tipoServicoTomado: String,
    descricao: String,
    valorMoeda: Number,
    cotacao: Number,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Não suporta async
// servicoSchema.virtual("valor").get(async function () {
//   if (this.cotacao) return this.valorMoeda * cotacao;
//   if (this.sigla === "BRL") return this.valorMoeda * 1;

//   const cotacao = await MoedaService.cotacao().consultar({ sigla: this.moeda });
//   return Number(this.valorMoeda * cotacao);
// });

module.exports = mongoose.model("Servico", servicoSchema);
