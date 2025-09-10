const mongoose = require('mongoose');
const path = require('path');
const { LISTAS } = require(path.join(process.cwd(), 'src', 'constants', 'listas'));

const VALIDACAO = [
  {
    validator: (data) => data.length <= 500,
    message: 'A lista de valores excedeu o limite de 500 elementos.',
  },
];

const ListaSchema = new mongoose.Schema({
  codigo: { type: String, enum: LISTAS, required: true, unique: true },
  data: {
    type: [{ valor: String }],
    validate: VALIDACAO,
  },
});

module.exports = mongoose.model('Lista', ListaSchema);
