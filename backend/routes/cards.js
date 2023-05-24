const cardRouter = require('express').Router(); // create a router
// import the celebrate validators
const {
  ValidateCard,
  ValidateCardId,
  ValidateDeleteCard,
} = require('../middleware/validation');

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

cardRouter.delete('/cards/:id', ValidateDeleteCard, deleteCard);

cardRouter.put('/cards/:cardId/likes', ValidateCardId, likeCard);

cardRouter.delete('/cards/:cardId/likes', ValidateCardId, dislikeCard);

module.exports = cardRouter;
