const mongoose = require("mongoose");

const createLogModel = () => {
  if (mongoose.models.Log) {
    return mongoose.models.Log;
  }

  const logSchema = new mongoose.Schema(
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: false,
      },
      endpoint: {
        type: String,
        required: true,
      },
      metodo: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
        required: true,
      },
      dadosRequisicao: {
        type: Object,
      },
      dadosResposta: {
        type: Object,
      },
      statusResposta: {
        type: Number,
      },
    },
    {
      timestamps: true,
    },
  );

  return mongoose.model("Log", logSchema);
};

module.exports = createLogModel;
