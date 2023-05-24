const { errorlogger } = require('../loggers');

// how to call it
// next(new InvalidInput('message goes here'))

class Unique extends Error {
  // used for 409 errors
  constructor(message) {
    super(message);
    this.statusCode = 409;
    errorlogger.error(
      'The request could not be completed due to a conflict with the current state of the target resource. (409 error)'
    );
  }
}

module.exports = {
  Unique,
};
