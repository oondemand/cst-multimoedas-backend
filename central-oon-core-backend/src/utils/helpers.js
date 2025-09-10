const { sendErrorResponse } = require("./response");

const sendResponse = ({ res, statusCode, message = "OK", ...rest }) => {
  res.status(statusCode).send({ message, ...rest });
};

const sendPaginatedResponse = ({
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

const asyncHandler = (callback) => {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next)).catch((error) => {
      console.log("🆘 [ERROR]:", error);
      next(error);
    });
  };
};

const attempt = async (callback) => {
  try {
    const result = await callback();
    return [result, null];
  } catch (err) {
    return [null, err];
  }
};

module.exports = {
  sendResponse,
  sendErrorResponse,
  sendPaginatedResponse,
  asyncHandler,
  attempt,
};
