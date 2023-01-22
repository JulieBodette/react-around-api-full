const userRouter = require('express').Router(); // create a router
const {
  createUser,
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// GET http://localhost:3000/users
userRouter.get('/users', getUsers);

// GET http://localhost:3000/users/8340d0ec33270a25f2413b69
userRouter.get('/users/:id', getUser);

// POST a new user to the database. include json with name about, link, email, password
userRouter.post('/users', createUser);

// patch new user description ("about")
userRouter.patch('/users/me', updateUserInfo);

// patch new user avatar (image link)
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
