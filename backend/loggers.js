//set up error logging with winston
const winston = require('winston');

module.exports.requestlogger = winston.createLogger({
  level: 'info', // this is the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: 'request.log' })],
});

module.exports.errorlogger = winston.createLogger({
  level: 'error', // this is the minimum log level- it will not log "less important" stuff
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: 'error.log' })],
});
