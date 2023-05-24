const { INVALID_INPUT } = require('../utils');
const { errorlogger } = require('../loggers');

class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_INPUT;
    errorlogger.error('Invalid input was sent to an api call. (400 error)');
  }
}
// how to call it
// next(new InvalidInput('message goes here'))

module.exports = {
  InvalidInput,
};
