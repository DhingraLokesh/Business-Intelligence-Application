class ApiError extends Error {
  statusCode;
  isOperational;
  serverMessage;
  stack;

  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.serverMessage = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
