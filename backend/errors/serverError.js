const { SERVER_ERROR } = require('../utils');
const { errorlogger } = require('../loggers');

// how to call it
// next(new ServerError('message goes here'))

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
    errorlogger.error('An error ocurred on the server. (500 error)');
  }
}

module.exports = {
  ServerError,
};
