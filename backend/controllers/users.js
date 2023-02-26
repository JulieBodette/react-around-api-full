const User = require('../models/user');
const bcryptjs = require('bcryptjs'); // importing bcrypt- need it to hash passwords
const jwt = require('jsonwebtoken');
const { NOT_FOUND, SERVER_ERROR, INVALID_INPUT } = require('../utils');

const login = (req, res) => {
  const { email, password } = req.body; // get email and password out of the request body
  //authenticate the email and password
  User.findOne({ email })
    .select('+password') //.select('+password') gets the user's password hash, even though it is not included by default.
    .then(async (user) => {
      if (!user) {
        // user not found
        // fire the catch block with an error
        return Promise.reject(new Error('Incorrect password or email'));
      }
      // user found - check if the password is correct

      var isPasswordCorrect = bcryptjs.compareSync(password, user.password);
      //returns true if password the user entered matches the one in the database, else false
      //The email and password are correct.
      //create a JSON web token (JWT) that expires after a week.
      if (isPasswordCorrect) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        }); //token is the payload. after the auth function (see auth.js), access it using req.user

        res.status(200).send({ token: token });
        //could also do res.send(token);- same thing, status is 200 by default
      } else {
        //password incorrect
        return Promise.reject(new Error('Incorrect password or email'));
        //If the password is incorrect, fire the catch block with an error
      }
    })

    .catch((err) => {
      // return an authentication error
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body; // get name etc out of the request body
  bcryptjs
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ user })) // returns to the client the user they just created
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_INPUT).send({ message: err.message });
        // error status 400 because user sent invalid input
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
        // error status 500-server error
      }
    });
  // err is an object so we use err.message to get the message string
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users })) // returns to the client all the users
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
  // err is an object so we use err.message to get the message string
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail() // throws an error if user does not exist
    .then((users) => res.send({ data: users })) // returns to the client all the users
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid user ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That user ID does not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
  // err is an object so we use err.message to get the message string
};

//RETURNS INFO ABOUT THE CURRENT USER
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    // throws an error if user does not exist
    .then((users) => res.send({ data: users }))
    // returns to the client all the users
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid user ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That user ID does not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
  // err is an object so we use err.message to get the message string
};

// patch user description
const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { about: req.body.about, name: req.body.name },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
      upsert: true, // if the user entry wasn't found, it will be created
    }
  )
    .orFail() // throws an error if user does not exist
    .then((user) => {
      // if the json that the client sent does not have an about ie {"about":"info here"}
      if (!req.body.about) {
        res
          .status(INVALID_INPUT)
          .send({ message: 'Error: You did not include an about field' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      // invalid user id
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid user ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That user ID does not exist' });
      } else if (err.name === 'ValidationError') {
        res.status(INVALID_INPUT).send({
          message:
            'Invalid input. Make sure the about field is minimum 2 and max 30 characters.',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

// patch user avatar
const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
      upsert: true, // if the user entry wasn't found, it will be created
    }
  )
    .then((user) => {
      // if the json that the client sent does not have an about ie {"avatar":"http://link-to-image"}
      if (!req.body.avatar) {
        res
          .status(INVALID_INPUT)
          .send({ message: 'Error: You did not include an avatar field' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      // invalid user id
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid user ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That user ID does not exist' });
      } else if (err.name === 'ValidationError') {
        res.status(INVALID_INPUT).send({
          message: 'Invalid input. Make sure the avatar field is a valid url',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
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
