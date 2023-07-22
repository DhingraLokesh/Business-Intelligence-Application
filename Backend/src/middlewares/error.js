import httpStatus from "http-status";
import config from "../configuration/config-variables/index.js";
import ApiError from "../utils/api-error/index.js"

// middleware to controll error
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// middleware to handle error
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;
  res.locals.stack = err.stack;

  const response = {
    code: statusCode,
    message,
    stack: err.stack,
  };

  if (config.env === "development") {
    console.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
