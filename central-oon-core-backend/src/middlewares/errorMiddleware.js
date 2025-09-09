const multer = require('multer');
const GenericError = require('../errors/GenericError');
const { sendErrorResponse } = require('../utils/response');

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

  if (error instanceof GenericError) {
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
