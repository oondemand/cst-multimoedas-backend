const GenericError = require("../generic");

class IntegracaoNaoEncontradoError extends GenericError {
  constructor() {
    super("Integração não encontrada!", 404);
  }
}

module.exports = IntegracaoNaoEncontradoError;
