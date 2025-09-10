const mongoose = require('mongoose');
const path = require('path');
const { ACOES, ENTIDADES, ORIGENS } = require(path.join(process.cwd(), 'src', 'constants', 'controleAlteracao'));

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
    enum: Object.values(ENTIDADES),
    required: true,
  },
  acao: {
    type: String,
    enum: Object.values(ACOES),
    required: true,
  },
  origem: {
    type: String,
    enum: Object.values(ORIGENS),
    required: true,
  },
  idRegistro: {
    type: String,
  },
  dadosAtualizados: {
    type: Object,
  },
});

module.exports = mongoose.model('ControleAlteracao', controleAlteracaoSchema);
