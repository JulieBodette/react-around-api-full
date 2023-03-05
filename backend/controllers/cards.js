const Card = require('../models/card');
const { NOT_FOUND, SERVER_ERROR, INVALID_INPUT } = require('../utils');
const {
  InvalidInput,
  NotFound,
  ServerError,
  NotAuthorized,
} = require('../errors');

// getCards returns all cards
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards })) // returns to the client all the cards
    .catch((err) => next(new ServerError(err.message)));
  // err is an object so we use err.message to get the message string
};

// createCard creates a new card
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body; // get name etc out of the request body
  Card.create({ name, link, owner })
    .then((card) => res.send(card)) // returns to the client the user they just created
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidInput(err.message));
        // error status 400 because user sent invalid input
      } else {
        next(new ServerError(err.message));
        // error status 500-server error
      }
    });
  // err is an object so we use err.message to get the message string
};

// deleteCard deletes a card by ID
const deleteCard = (req, res, next) => {
  //check that the card belongs to the current user (otherwise they do not have permission to delete it)

  //req.user._id is the id of the current user/the user sending the request
  Card.findById(req.params.id)
    .then((card) => {
      if (req.user._id != card.owner) {
        //the card does not belong to current user-they do not have permission to delete it
        throw new Error('Forbidden');
      } //delete the card
      else {
        return Card.findByIdAndDelete(req.params.id).orFail(); // throws an error if card does not exist
      }
    })

    .then((card) => res.send({ data: card })) // returns to the client the card they just deleted
    .catch((err) => {
      if (err.message == 'Forbidden') {
        next(
          new NotAuthorized(
            'That card does not belong to that user. They are not authorized to delete it.'
          )
        );
      } else if (err.name === 'CastError') {
        next(new InvalidInput('Invalid card ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That card ID does not exist'));
      } else {
        next(new ServerError(err.message));
      }
    });
  // err is an object so we use err.message to get the message string
};

// likeCard
// PUT /cards/:cardId/likes — like a card
const likeCard = (req, res, next) => {
  // special operation $addToSet means we only add the like if it is not already there
  // ie each user can only like a card once
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    // {new:true} is in the options object, it makes sure the client gets the updated card
    // without this, the user would get the card with the old list of likes
    // (the old list does not include the like they just added with this api call)
    .orFail() // throw an error if the card is null/ no card with that ID exists
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid card ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That card ID does not exist'));
      } else {
        next(new ServerError(err.message));
      }
    });
  // err is an object so we use err.message to get the message string
};

// dislikeCard
const dislikeCard = (req, res, next) => {
  // special operation $pull means we remove the item from the array
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    // {new:true} is in the options object, it makes sure the client gets the updated card
    .orFail() // throws an error if card does not exist
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidInput('Invalid card ID'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('That card ID does not exist'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
