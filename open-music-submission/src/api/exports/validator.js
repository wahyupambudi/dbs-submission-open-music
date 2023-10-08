const Joi = require('joi');
const { InvariantError } = require('../../commons/exceptions');

const PostExportPlaylistsSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

const ExportsValidator = {
  validatePostExportPlaylistsPayload(payload) {
    const validationResult = PostExportPlaylistsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = ExportsValidator;
