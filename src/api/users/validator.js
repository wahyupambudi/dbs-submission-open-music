const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');

const UsersValidator = {
  validatePostUsersPayload: (payload) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      fullname: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
};

module.exports = UsersValidator;
