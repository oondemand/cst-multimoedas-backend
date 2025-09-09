class GenericError extends Error {
  constructor(
    message = "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
    statusCode = 500,
    details = "internal server error"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = GenericError;
