const { errorlogger } = require('../loggers');

// how to call it
// next(new InvalidInput('message goes here'))

class Forbidden extends Error {
  // used for 403 errors
  constructor(message) {
    super(message);
    this.statusCode = 403;
    errorlogger.error(
      'User provided valid credentials. but based on who they are, they are not authorized to acess this page. (403 error)'
    );
  }
}

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
  Forbidden,
  Unique,
};
