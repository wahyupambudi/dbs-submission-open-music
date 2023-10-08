const {
  ForbiddenError,
  NotFoundError,
} = require('../../commons/exceptions');

class PlaylistsHandler {
  constructor(validator, playlistsService) {
    this._validator = validator;
    this._playlistsService = playlistsService;
  }

  async postPlaylistHandler(request, h) {
    const { userId: owner } = request.auth.credentials;
    const { name } = this._validator.validatePostPlaylistPayload(request.payload);

    const playlistId = await this._playlistsService.persistPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { userId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(userId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postSongToPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validatePostPlaylistSongPayload(request.payload);
    const { userId: owner } = request.auth.credentials;

    const isOwnedPlaylist = await this._playlistsService.isPlaylistOwnedBy(playlistId, owner);

    if (!isOwnedPlaylist) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }

    const isSongExist = await this._playlistsService.isSongExists(songId);

    if (!isSongExist) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    await this._playlistsService.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { userId: owner } = request.auth.credentials;

    const isPlaylistExists = await this._playlistsService.isPlaylistExists(playlistId);

    if (!isPlaylistExists) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const isOwnedPlaylist = await this._playlistsService.isPlaylistOwnedBy(playlistId, owner);

    if (!isOwnedPlaylist) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongsByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validatePostPlaylistSongPayload(request.payload);
    const { userId: owner } = request.auth.credentials;

    const isOwnedPlaylist = await this._playlistsService.isPlaylistOwnedBy(playlistId, owner);

    if (!isOwnedPlaylist) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }

    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: owner } = request.auth.credentials;

    const isOwnedPlaylist = await this._playlistsService.isPlaylistOwnedBy(playlistId, owner);

    if (!isOwnedPlaylist) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }

    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
