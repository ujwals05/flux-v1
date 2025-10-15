class APIerror extends Error {
  constructor(statusCode, message, error = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = false;
    this.success = false;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export {APIerror}
