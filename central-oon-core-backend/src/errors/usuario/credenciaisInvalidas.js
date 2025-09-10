const GenericError = require("../GenericError");

class CredenciaisInvalidasError extends GenericError {
  constructor() {
    super("Credenciais inválidas!", 401);
  }
}

module.exports = CredenciaisInvalidasError;
