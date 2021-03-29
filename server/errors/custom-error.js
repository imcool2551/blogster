class CustomError extends Error {
  statusCode = 400;

  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = CustomError;
