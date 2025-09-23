const mongoose = require("mongoose");

const createMoedaModel = () => {
  if (mongoose.models.Moeda) {
    return mongoose.models.Moeda;
  }

  const moedaSchema = new mongoose.Schema(
    {
      sigla: { type: String, require: true },
      cotacao: { type: Number, default: 1 },
      requisicao: {
        type: {
          url: { type: String, default: "" },
          body: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
      },
      resposta: Object,
      atualizadoEm: { type: Date, default: new Date() },
      status: {
        type: String,
        enum: ["ativo", "inativo", "arquivado"],
        default: "ativo",
      },
    },
    { timestamps: true },
  );

  return mongoose.model("Moeda", moedaSchema);
};

module.exports = createMoedaModel;
