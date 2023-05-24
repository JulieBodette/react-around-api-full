require('dotenv').config(); // access .env file
const bcryptjs = require('bcryptjs'); // importing bcrypt- need it to hash passwords
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  InvalidInput,
  WrongUsernamePassword,
  NotFound,
  ServerError,
  Unique,
} = require('../errors/errors');

const login = (req, res, next) => {
  const { email, password } = req.body; // get email and password out of the request body
  // authenticate the email and password
  User.findOne({ email })
    .select('+password') // .select('+password') gets the user's password hash, even though it is not included by default.
    .then((user) => {
      if (!user) {
        // user not found
        // fire the catch block with an error
        throw new Error('Incorrect password or email');
      }
      // user found - check if the password is correct

      const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
      // returns true if password the user entered matches the one in the database, else false
      // The email and password are correct.
      // create a JSON web token (JWT) that expires after a week.
      if (!isPasswordCorrect) {
        throw new Error('Incorrect password or email');
        // If the password is incorrect, fire the catch block with an error
      }
      // if we got here, password is correct
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production'
          ? process.env.JWT_SECRET
          : 'some-secret-key',
        {
          expiresIn: '7d',
        }
      ); // token is the payload. after the auth function (see auth.js), access it using req.user
      // if in production mode, read JWT_SECRET key from the .env file.
      // Otherwise use the string 'some-secret-key'.

      res.status(200).send({ token });
      // could also do res.send(token);- same thing, status is 200 by default
    })

    .catch((err) => {
      // return an authentication (401) error
      next(new WrongUsernamePassword(err.message));
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body; // get name etc out of the request body
  bcryptjs
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.send({ user }); // returns to the client the user they just created
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Unique(err.message));
        // 409 error- email address must be unique (2 accounts cannot have same email address)
      } else if (err.name === 'ValidationError') {
        next(new InvalidInput(err.message));
        // error status 400 because user sent invalid input
      } else {
        next(new ServerError(err.message));
        // error status 500-server error
      }
    });
  // err is an object so we use err.message to get the message string
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users }); // returns to the client all the users
    })
    .catch((err) => next(new ServerError(err.message)));
  // err is an object so we use err.message to get the message string
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail() // throws an error if user does not exist
    .then((user) => {
      res.send({ data: user }); // returns to the client the user with given id
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid user ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That user ID does not exist'));
      } else {
        next(new ServerError(err.message));
        // err is an object so we use err.message to get the message string
      }
    });
};

// RETURNS INFO ABOUT THE CURRENT USER
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    // throws an error if user does not exist
    .then((user) => {
      res.send({ data: user }); // returns to the client the user with specified id
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid user ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That user ID does not exist'));
      } else {
        next(new ServerError(err.message));
      }
    });
  // err is an object so we use err.message to get the message string
};

// patch user description
const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { about: req.body.about, name: req.body.name },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .orFail() // throws an error if user does not exist
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      // invalid user id
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid user ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That user ID does not exist'));
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidInput(
            'Invalid input. Make sure the about field is minimum 2 and max 30 characters.'
          )
        );
      } else {
        next(new ServerError(err.message));
      }
    });
};

// patch user avatar
const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      // invalid user id
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid user ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That user ID does not exist'));
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidInput(
            'Invalid input. Make sure the avatar field is a valid url'
          )
        );
      } else {
        next(new ServerError(err.message));
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
