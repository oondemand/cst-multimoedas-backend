exports.sendResponse = ({ res, statusCode, message = "OK", ...rest }) => {
  res.status(statusCode).send({ message, ...rest });
};

exports.sendErrorResponse = ({ res, statusCode, message, error }) => {
  res.status(statusCode).json({
    message,
    ...(error ? { error } : {}),
  });
};

exports.sendPaginatedResponse = ({
  res,
  statusCode,
  message,
  results,
  pagination: { currentPage, totalPages, totalItems, itemsPerPage },
}) => {
  res.status(statusCode).json({
    message,
    results,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    },
  });
};

exports.asyncHandler = (callback) => {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next)).catch((error) => {
      console.log("🆘 [ERROR]:", error);
      next(error);
    });
  };
};

exports.attempt = async (callback) => {
  try {
    const result = await callback();
    return [result, null];
  } catch (err) {
    return [null, err];
  }
};
