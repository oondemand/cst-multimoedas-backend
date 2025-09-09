const sendErrorResponse = ({ res, statusCode, message, error }) => {
  res.status(statusCode).json({
    message,
    ...(error ? { error } : {}),
  });
};

module.exports = { sendErrorResponse };
