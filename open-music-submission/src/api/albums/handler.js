const { join } = require('path');
const {
  NotFoundError,
  InvariantError,
} = require('../../commons/exceptions');
const { config } = require('../../commons/config');

class AlbumsHandler {
  constructor(validator, albumsService, storageService, userAlbumLikesService) {
    this._validator = validator;
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._userAlbumLikesService = userAlbumLikesService;
  }

  async postAlbumHandler(request, h) {
    const { name, year } = this._validator.validatePostAlbumPayload(request.payload);
    const albumId = await this._albumsService.persistAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { id } = request.params;
    const { name, year } = this._validator.validatePutAlbumPayload(request.payload);

    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'album updated',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'album deleted',
    };
  }

  async postAlbumCoverByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { cover } = this._validator.validatePutAlbumCoverPayload(request.payload);
    const fileExtension = cover.hapi.filename.split('.').pop();

    const filename = await this._storageService.saveAlbumArt(albumId, cover, fileExtension);

    await this._albumsService.setCoverUrlToAlbum(albumId, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async getAlbumCoverByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const isExist = await this._albumsService.isAlbumExist(albumId);

    if (!isExist) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const coverFile = await this._albumsService.getCoverAlbumById(albumId);

    if (!coverFile) {
      throw new NotFoundError('cover tidak ditemukan');
    }

    const filePath = join(config.app.imagesPublicPath, coverFile);

    // @TODO-8: kembalikan response dengan file yang diambil dari variable `filePath`
    // Referensi: https://www.dicoding.com/academies/271/tutorials/17753
  }

  async postLikeAlbumByIdHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const isExist = await this._albumsService.isAlbumExist(albumId);

    if (!isExist) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const isLiked = await this._userAlbumLikesService.isUserAlreadyLikedAlbum(userId, albumId);

    if (isLiked) {
      throw new InvariantError('Album sudah disukai');
    }

    await this._userAlbumLikesService.persistUserAlbumLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const isExist = await this._albumsService.isAlbumExist(albumId);

    if (!isExist) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const { source, count } = await this._userAlbumLikesService.countLikesByAlbumId(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: count,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikeAlbumByIdHandler(request) {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    const isExist = await this._albumsService.isAlbumExist(albumId);

    if (!isExist) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    await this._userAlbumLikesService.deleteUserAlbumLike(userId, albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus dari daftar suka',
    };
  }
}

module.exports = AlbumsHandler;
