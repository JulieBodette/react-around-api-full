const { errorlogger } = require('../loggers');

// how to call it
// next(new NotAuthorized('message goes here'))

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

module.exports = {
  NotAuthorized,
};
