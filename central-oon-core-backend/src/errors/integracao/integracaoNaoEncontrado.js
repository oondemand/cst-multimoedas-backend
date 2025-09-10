const GenericError = require("../GenericError");

class IntegracaoNaoEncontradoError extends GenericError {
  constructor() {
    super("Integração não encontrada!", 404);
  }
}

module.exports = IntegracaoNaoEncontradoError;
