const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServicoTomadoTicketSchema = new mongoose.Schema(
  {
    baseOmie: { type: Schema.Types.ObjectId, ref: "BaseOmie" },
    titulo: { type: String, required: true },
    observacao: { type: String, default: "" },
    etapa: { type: String, required: true },
    pessoa: { type: mongoose.Schema.Types.ObjectId, ref: "Pessoa" },
    arquivos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Arquivo" }],
    servicos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Servico" }],
    contaPagarOmie: { type: Schema.Types.ObjectId, ref: "ContaPagar" },
    conta_corrente: { type: String },
    codigo_categoria: { type: String },
    status: {
      type: String,
      enum: [
        "aguardando-inicio",
        "trabalhando",
        "revisao",
        "arquivado",
        "concluido",
      ],
      default: "aguardando-inicio",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ServicoTomadoTicket",
  ServicoTomadoTicketSchema
);
