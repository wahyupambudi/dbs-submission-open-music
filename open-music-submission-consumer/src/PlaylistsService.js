const { Pool } = require('pg');
const config = require("./config");

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      user: config.postgres.username,
      password: config.postgres.password,
    });
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name
      FROM playlists
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists_songs
      LEFT JOIN songs ON songs.id = playlists_songs.song_id
      WHERE playlists_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = PlaylistsService;
