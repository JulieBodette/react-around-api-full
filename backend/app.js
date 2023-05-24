const express = require('express');
const bodyParser = require('body-parser'); // so we can pull post body in json fprmat
// use helmet to make server more secure (ie against XSS anf to use HTTPS)
const helmet = require('helmet');
const { default: mongoose } = require('mongoose');
// limit the rate to prevent DOS attacks
const rateLimit = require('express-rate-limit');
// celebrate error handler
const { errors } = require('celebrate');
// custom validation functions ( I made them using joi and celebrate)
const cors = require('cors');
const {
  ValidateUserOnLogin,
  ValidateUserOnCreate,
} = require('./middleware/validation');
// import the routers from cards.js and users.js
const cardsRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const { auth } = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');

// import error codes
const { NOT_FOUND } = require('./utils');

const winston = require('winston');
const expressWinston = require('express-winston');
const { requestlogger } = require('./loggers');
const { NotFound } = require('./errors');

requestlogger.info('Restarting the server');

const winstonRequestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
}); // create the request logger- it will log things automatically

// set up the server, default port 3000
const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet()); // use helmet to make server more secure
app.use(cors());
app.options('*', cors()); // enable requests for all routes

app.use(winstonRequestLogger); // request logger will log things automatically

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter); // Apply the rate limiting middleware to all requests

// connect to the MongoDB Server
mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(bodyParser.json()); // when we get a POST body, we can pull it in as JSON
app.use(bodyParser.urlencoded({ extended: true })); // unencode the URL so we can get our JSON out

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', ValidateUserOnLogin, login);
app.post('/signup', ValidateUserOnCreate, createUser); // POST a new user to the database. include json with name about, link, email, password

// authorization
app.use(auth);

// connect the routers- users can only acess these if they are authorized.
app.use('/', cardsRouter);
app.use('/', userRouter);

// celebrate error handler
app.use(errors());

// deal with 404 (page not found- the user's mistake)
// and 500 (general server error- the server's mistake)
// order is important- we check to see if it's 404 error
// and if it is not, it must be 500 error
app.use((req, res) =>
  //res.status(NOT_FOUND).send({ message: 'Requested resource not found' })
  {
    throw new NotFound('Requested resource not found');
  }
);

app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

// app.use((err, req, res) => res.status(SERVER_ERROR).send({ error: err }));

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
