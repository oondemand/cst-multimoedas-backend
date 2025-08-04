const GenericError = require("../generic");

class ContaPagarNaoEncontradoError extends GenericError {
  constructor() {
    super("Conta a pagar não encontrada!", 404);
  }
}

module.exports = ContaPagarNaoEncontradoError;
