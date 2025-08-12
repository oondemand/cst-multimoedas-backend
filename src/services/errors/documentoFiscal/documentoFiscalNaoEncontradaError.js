const GenericError = require("../generic");

class DocumentoFiscalNaoEncontradaError extends GenericError {
  constructor() {
    super("Documento fiscal não encontrado!", 404);
  }
}

module.exports = DocumentoFiscalNaoEncontradaError;
