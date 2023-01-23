const { createUser, login } = require('./controllers/users');
const express = require('express');
const bodyParser = require('body-parser'); // so we can pull post body in json fprmat
// use helmet to make server more secure (ie against XSS anf to use HTTPS)
const helmet = require('helmet');
const { default: mongoose } = require('mongoose');
//limit the rate to prevent DOS attacks
const rateLimit = require('express-rate-limit');

// import the routers from cards.js and users.js
const cardsRouter = require('./routes/cards');
const userRouter = require('./routes/users');

// import error codes
const { NOT_FOUND, SERVER_ERROR } = require('./utils');

// set up the server, default port 3000
const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet()); // use helmet to make server more secure

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

// every time a request comes in, manually set the user to this id
// temporary solution until we enable authorization
//app.use((req, res, next) => {
// req.user = { _id: '631fb9ac180fd401551bca0f' };
// next(); // once this middleware is done, calls the next function
//});

app.post('/signin', login);
app.post('/signup', createUser);

// connect the routers
app.use('/', cardsRouter);
app.use('/', userRouter);

// deal with 404 (page not found- the user's mistake)
// and 500 (general server error- the server's mistake)
// order is important- we check to see if it's 404 error
// and if it is not, it must be 500 error
app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' })
);

app.use((err, req, res) => res.status(SERVER_ERROR).send({ error: err }));

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
