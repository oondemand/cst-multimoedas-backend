const mongoose = require("mongoose");

class CompetenciaType extends mongoose.SchemaType {
  constructor(path, options) {
    super(path, options, "CompetenciaType");
  }

  cast(val) {
    if (val.mes < 1 || val.mes > 12) {
      throw new Error("Mês inválido (1-12).");
    }
    if (val.ano < 2000) {
      throw new Error("Ano mínimo é 2000.");
    }
    return val;
  }
}

mongoose.Schema.Types.CompetenciaType = CompetenciaType;

const documentoFiscalSchema = new mongoose.Schema(
  {
    pessoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pessoa",
      required: [true],
    },
    tipoDocumentoFiscal: {
      type: String,
    },
    competencia: {
      type: CompetenciaType,
    },
    numero: {
      type: String,
      required: [true, "Número é obrigatório"],
    },
    valor: {
      type: Number,
      required: [true, "Valor é obrigatório"],
      min: [0, "Valor não pode ser negativo"],
    },
    imposto: { type: Number, default: 0 },
    classificacaoFiscal: String,
    descricao: { type: String },
    observacao: { type: String },
    motivoRecusa: { type: String },
    arquivo: { type: mongoose.Schema.Types.ObjectId, ref: "Arquivo" },
    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },
    statusValidacao: {
      type: String,
      enum: ["pendente", "recusado", "aprovado"],
      default: "pendente",
    },
    statusPagamento: {
      type: String,
      enum: ["aberto", "processando", "pago"],
      default: "aberto",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DocumentoFiscal", documentoFiscalSchema);
