const GenericError = require("../generic");

class DocumentoCadastralNaoEncontradaError extends GenericError {
  constructor() {
    super("Documento cadastral não encontrado!", 404);
  }
}

module.exports = DocumentoCadastralNaoEncontradaError;
