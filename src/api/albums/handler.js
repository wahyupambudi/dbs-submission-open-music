const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(validator, service) {
    this._validator = validator;
    this._service = service;

    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }

  async postAlbumHandler(request, h) {
    const { name, year } = this._validator.validatePostAlbumPayload(
      request.payload
    );
    const albumId = await this._service.persistAlbum({ name, year });

    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    // album.songs = await this._service.getSongByAlbumId(id);

    // if (songs === null) album.songs = [];
    // else album.songs = songs;

    // if (songs === null) {
    //   album.songs = [];
    // } else {
    //   album.songs = songs;
    //   // console.log(album);
    // }

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { id } = request.params;
    const { name, year } = this._validator.validatePutAlbumPayload(
      request.payload
    );

    await this._service.editAlbumById(id, { name, year });

    return {
      status: "success",
      message: "album updated",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "album deleted",
    };
  }
}

module.exports = AlbumsHandler;
