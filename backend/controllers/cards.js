const Card = require('../models/card');
const { NOT_FOUND, SERVER_ERROR, INVALID_INPUT } = require('../utils');

// getCards returns all cards
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards })) // returns to the client all the cards
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
  // err is an object so we use err.message to get the message string
};

// createCard creates a new card
const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body; // get name etc out of the request body
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card })) // returns to the client the user they just created
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

// deleteCard deletes a card by ID
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail()// throws an error if card does not exist
    .then((card) => res.send({ data: card })) // returns to the client the user they just created
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid card ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That card ID does not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
  // err is an object so we use err.message to get the message string
};

// likeCard
// PUT /cards/:cardId/likes — like a card
const likeCard = (req, res) => {
  // special operation $addToSet means we only add the like if it is not already there
  // ie each user can only like a card once
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // {new:true} is in the options object, it makes sure the client gets the updated card
  // without this, the user would get the card with the old list of likes
  // (the old list does not include the like they just added with this api call)
    .orFail()// throw an error if the card is null/ no card with that ID exists
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid card ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That card ID does not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
  // err is an object so we use err.message to get the message string
};

// dislikeCard
const dislikeCard = (req, res) => {
  // special operation $pull means we remove the item from the array
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    // {new:true} is in the options object, it makes sure the client gets the updated card
    .orFail()// throws an error if card does not exist
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_INPUT).send({ message: 'Invalid card ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'That card ID does not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
