const { INVALID_INPUT } = require('./utils');

class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_INPUT;
  }
}
//how to call it
//next(new InvalidInput('message goes here'))

module.exports = {
  InvalidInput,
};
