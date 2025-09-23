const mongoose = require("mongoose");
const { resolveEnumValues } = require("./utils");

const createControleAlteracaoModel = ({ controleAlteracao = {} } = {}) => {
  if (mongoose.models.ControleAlteracao) {
    return mongoose.models.ControleAlteracao;
  }

  const { entidades, acoes, origens } = controleAlteracao;

  const controleAlteracaoSchema = new mongoose.Schema({
    dataHora: {
      type: Date,
      default: Date.now,
      required: true,
    },
    usuario: {
      nome: String,
      email: String,
    },
    entidade: {
      type: String,
      enum: resolveEnumValues(entidades),
      required: true,
    },
    acao: {
      type: String,
      enum: resolveEnumValues(acoes),
      required: true,
    },
    origem: {
      type: String,
      enum: resolveEnumValues(origens),
      required: true,
    },
    idRegistro: {
      type: String,
    },
    dadosAtualizados: {
      type: Object,
    },
  });

  return mongoose.model("ControleAlteracao", controleAlteracaoSchema);
};

module.exports = createControleAlteracaoModel;
