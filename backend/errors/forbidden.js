const { errorlogger } = require('../loggers');

// how to call it
// next(new Forbidden('message goes here'))

class Forbidden extends Error {
  // used for 403 errors
  constructor(message) {
    super(message);
    this.statusCode = 403;
    errorlogger.error(
      'User provided valid credentials. but based on who they are, they are not authorized to acess this page. (403 error)',
    );
  }
}

module.exports = {
  Forbidden,
};
