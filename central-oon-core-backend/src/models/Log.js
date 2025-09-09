const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
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

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
