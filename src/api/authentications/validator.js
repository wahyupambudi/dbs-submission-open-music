const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },

  validatePutAuthenticationPayload: (payload) => {
    const schema = Joi.object({
      refreshToken: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const schema = Joi.object({
      refreshToken: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
};

module.exports = AuthenticationsValidator;
