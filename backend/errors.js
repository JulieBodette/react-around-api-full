const { INVALID_INPUT, SERVER_ERROR, NOT_FOUND } = require('./utils');
const { errorlogger } = require('./loggers');

class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_INPUT;
    errorlogger.error('INvalid input was sent to an api call.');
  }
}
// how to call it
// next(new InvalidInput('message goes here'))

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
    errorlogger.error('An error ocurred on the server.');
  }
}

class WrongUsernamePassword extends Error {
  // used for incorrect username and incorrect password
  constructor(message) {
    super(message);
    this.statusCode = 401;
    errorlogger.error(
      'A user attempted to log in with the wrong username or password.'
    );
  }
}

class NotAuthorized extends Error {
  // used for incorrect username and incorrect password
  constructor(message) {
    super(message);
    this.statusCode = 401;
    errorlogger.error(
      'A user attempted to reach a page that they are not authorized to access (401 error).'
    );
  }
}

class NotFound extends Error {
  // used for 404 errors
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    errorlogger.error(
      'A user attempted to reach a page that does not exist (404 error).'
    );
  }
}

module.exports = {
  InvalidInput,
  ServerError,
  WrongUsernamePassword,
  NotFound,
  NotAuthorized,
};
