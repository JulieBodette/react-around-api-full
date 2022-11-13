const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
    },
    // regular expression to validate that it is url- begins with http:// or https://, www. optional, may end in #
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // unsure if I did the likes array correctly..need to test it
  likes:
  {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt:
  {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
