const CustomError = require('./custom-error');

class UnauthorizedError extends CustomError {
  statusCode = 401;
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = UnauthorizedError;
