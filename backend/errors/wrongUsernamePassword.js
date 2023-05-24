const { errorlogger } = require('../loggers');

// how to call it
// next(new WrongUsernamePassword('message goes here'))

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

module.exports = {
  WrongUsernamePassword,
};
