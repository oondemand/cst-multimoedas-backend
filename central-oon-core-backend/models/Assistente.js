const mongoose = require("mongoose");

const createAssistenteModel = () => {
  if (mongoose.models.Assistente) {
    return mongoose.models.Assistente;
  }

  const AssistenteSchema = new mongoose.Schema(
    {
      modulo: {
        type: String,
        required: true,
        trim: true,
      },
      assistente: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        enum: ["ativo", "inativo"],
        default: "ativo",
      },
    },
    {
      timestamps: true,
    },
  );

  return mongoose.model("Assistente", AssistenteSchema);
};

module.exports = createAssistenteModel;
