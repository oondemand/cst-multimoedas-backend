const ContaPagar = require("../../../models/ContaPagar");
const { formatarDataOmie } = require("../../../../packages/central-oon-core-backend/src/utils/dateUtils");

const mapExporter = ({ contaPagar }) => {
  try {
    const conta = {
      codigo_lancamento_integracao: contaPagar.codigo_lancamento_integracao,
      numero_documento: contaPagar.numero_documento,
      numero_documento_fiscal: contaPagar.numero_documento_fiscal,
      codigo_cliente_fornecedor: contaPagar.codigo_cliente_fornecedor,
      valor_documento: parseFloat(contaPagar.valor_documento),
      data_emissao: formatarDataOmie(contaPagar.data_emissao),
      data_vencimento: formatarDataOmie(contaPagar.data_vencimento),
      data_previsao: formatarDataOmie(contaPagar.data_previsao),
      data_entrada: formatarDataOmie(contaPagar.data_entrada),
      // numero_documento_fiscal: notaFiscal,
      codigo_categoria: contaPagar.codigo_categoria,
      observacao: contaPagar.observacao,
    };

    return conta;
  } catch (error) {
    throw new Error("Erro ao formatar conta pagar: " + error);
  }
};

module.exports = {
  mapExporter,
};
