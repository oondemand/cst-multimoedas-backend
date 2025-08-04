const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContaPagarSchema = new mongoose.Schema({
  data_previsao: { type: Date },
  data_entrada: { type: Date },
  codigo_lancamento_omie: { type: Number },
  codigo_lancamento_integracao: { type: String },
  codigo_cliente_fornecedor: { type: String },
  data_vencimento: { type: Date },
  valor_documento: { type: Number },
  numero_documento_fiscal: { type: String },
  data_emissao: { type: Date },
  numero_documento: { type: String },
  numero_parcela: { type: String },
  status_titulo: { type: String },
  valor_pag: { type: Number },
  codigo_categoria: { type: String },
  observacao: { type: String },
  id_conta_corrente: String,
});

module.exports = mongoose.model("ContaPagar", ContaPagarSchema);
