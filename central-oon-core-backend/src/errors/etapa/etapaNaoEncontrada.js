const GenericError = require('../GenericError');

class EtapaNaoEncontradaError extends GenericError {
  constructor() {
    super('Etapa não encontrada!', 404);
  }
}

module.exports = EtapaNaoEncontradaError;
