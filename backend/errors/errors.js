const { NOT_FOUND } = require('../utils');
const { errorlogger } = require('../loggers');

// how to call it
// next(new InvalidInput('message goes here'))

class WrongUsernamePassword extends Error {
  // used for incorrect username and incorrect password
  constructor(message) {
    super(message);
    this.statusCode = 401;
    errorlogger.error(
      'A user attempted to log in with the wrong username or password. (401 error)'
    );
  }
}

class NotAuthorized extends Error {
  // used for incorrect username and incorrect password
  constructor(message) {
    super(message);
    this.statusCode = 401;
    errorlogger.error(
      'A user attempted to reach a page that they are not authorized to access. Try again with correct credientials. (401 error)'
    );
  }
}

class NotFound extends Error {
  // used for 404 errors
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    errorlogger.error(
      'A user attempted to reach a page that does not exist. (404 error)'
    );
  }
}

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
  WrongUsernamePassword,
  NotFound,
  NotAuthorized,
  Forbidden,
  Unique,
};
