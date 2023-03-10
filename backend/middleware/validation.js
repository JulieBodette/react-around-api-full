const { celebrate, Joi } = require('celebrate'); //use celebrate for validation
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

//module.exports.ValidateUser = celebrate({});

module.exports.ValidateCard = celebrate({
  //TO DO: added Hello to the beginning of each message for testing purposes- delete later
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'Hello The minimum length of the "name" field is 2',
      'string.max': 'HelloThe maximum length of the "name" field is 30',
      'string.empty': 'HelloThe "name" field must be filled in',
    }),

    link: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'Hello The "link" field must be filled in',
      'string.uri': 'Hello the "link" field must be a valid url',
    }),
    likes: Joi.array().required(),
    owner: Joi.object().required(),
    createdAt: Joi.date(),

    //TO DO: ADD THIS
    //likes is an array and its required
    //owner is a string and its required
  }),
});

//card has this
// name: imageName,
// link: imageLink,
// likes: [], //starts with no likes
// owner: currentUser,
