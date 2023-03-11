//import the celebrate validators
const {
  ValidateCard,
  ValidateLikeCard,
} = require('../middleware/validation.js');
const cardRouter = require('express').Router(); // create a router
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
// GET http://localhost:3000/cards

cardRouter.get('/cards', getCards);

// POST a new card to the database.
// include json with name, link, owner, creation date, and likes (empty array)
cardRouter.post('/cards', ValidateCard, createCard);

cardRouter.delete('/cards/:id', deleteCard);

cardRouter.put('/cards/:cardId/likes', ValidateLikeCard, likeCard);

cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
