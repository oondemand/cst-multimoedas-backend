const multer = require('multer');
const GenericError = require('../services/errors/generic');
const CoreGenericError = require('central-oon-core-backend/src/errors/GenericError');
const { sendErrorResponse } = require('../utils/helpers');

const errorMiddleware = (error, _, res, next) => {
  if (!error) return next();

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendErrorResponse({
        res,
        statusCode: 513,
        error: error.message,
        message: 'O arquivo enviado excede o tamanho máximo permitido!',
      });
    }

    return sendErrorResponse({
      res,
      statusCode: 500,
      error: error.message,
      message: 'Houve um erro inesperado!',
    });
  }

  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
    return sendErrorResponse({
      res,
      statusCode: 401,
      error: error.message,
      message: 'Token inválido ou expirado.',
    });
  }

  if (
    error instanceof GenericError ||
    error instanceof CoreGenericError ||
    typeof error.statusCode === 'number'
  ) {
    return sendErrorResponse({
      res,
      statusCode: error.statusCode,
      error: error.details,
      message: error.message,
    });
  }

  return sendErrorResponse({
    res,
    statusCode: 500,
    error: error.message,
    message: 'Houve um erro inesperado!',
  });
};

module.exports = errorMiddleware;
