const { NOT_FOUND } = require('../utils');
const { errorlogger } = require('../loggers');

// how to call it
// next(new NotFound('message goes here'))

class NotFound extends Error {
  // used for 404 errors
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    errorlogger.error(
      'A user attempted to reach a page that does not exist. (404 error)',
    );
  }
}

module.exports = {
  NotFound,
};
