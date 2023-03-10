const { celebrate, Joi } = require('celebrate'); //use celebrate for validation
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};
// initial user creation will only have email and password- thus, name about and avatar are not required.
// name about and avatar will be set to default values based on the schema- see models/user.js
module.exports.ValidateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      'string.uri': 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

module.exports.ValidateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),

    link: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "link" field must be filled in',
      'string.uri': 'The "link" field must be a valid url',
    }),
    likes: Joi.array().required(),
    owner: Joi.object().required(),
    createdAt: Joi.date(),
  }),
});
