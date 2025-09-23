const mongoose = require("mongoose");

const createEtapaModel = () => {
  if (mongoose.models.Etapa) {
    return mongoose.models.Etapa;
  }

  const etapaSchema = new mongoose.Schema(
    {
      nome: {
        type: String,
        required: true,
        trim: true,
      },
      esteira: {
        type: String,
        enum: ["servicos-tomados", "pedido-venda"],
        required: true,
      },
      codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      posicao: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["ativo", "inativo", "arquivado"],
        default: "ativo",
      },
    },
    {
      timestamps: true,
    },
  );

  return mongoose.model("Etapa", etapaSchema);
};

module.exports = createEtapaModel;
