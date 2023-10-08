const Joi = require("joi");
const { InvariantError } = require("../../commons/exceptions");

const AlbumsValidator = {
  validatePostAlbumPayload: (payload) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      year: Joi.number().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
  validatePutAlbumPayload: (payload) => {
    const scheme = Joi.object({
      name: Joi.string().required(),
      year: Joi.number().required(),
    });

    const result = scheme.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
  validatePutAlbumCoverPayload: (payload) => {
    const scheme = Joi.object({
      cover: Joi.object({
        hapi: Joi.object({
          filename: Joi.string().required(),
          headers: Joi.object({
            // @TODO-6: tambahkan validasi content-type hanya untuk menerima image saja. Referensi: https://www.dicoding.com/academies/271/tutorials/17743
            "content-type": Joi.string()
              .valid(
                "image/apng",
                "image/avif",
                "image/gif",
                "image/jpeg",
                "image/png",
                "image/webp",
              )
              .required(),
          }).unknown(),
        }).unknown(),
      })
        .unknown()
        .required(),
    });

    const result = scheme.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }

    return result.value;
  },
};

module.exports = AlbumsValidator;
