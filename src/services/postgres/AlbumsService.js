const { nanoid } = require("nanoid");
const { pool } = require("./pool");
const { NotFoundError } = require("../../commons/exceptions");

class AlbumsService {
  constructor() {
    this._pool = pool;
  }

  async persistAlbum({ name, year }) {
    const id = `albums-${nanoid(16)}`;

    /**
     * 6. @TODO
     * Buatlah variabel query sebagai postgres query untuk menyimpan album ke database
     * dengan menggunakan method `this._pool.query()`
     *
     * referensi: https://www.dicoding.com/academies/271/tutorials/17476
     */

    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3)",
      values: [id, name, year],
    };

    await this._pool.query(query);

    return id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT id, name, year FROM albums WHERE id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("Album tidak ditemukan", 404);
    }

    return rows[0];
  }

  // opsional
  async getSongByAlbumId(id) {
    const query = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("Album tidak ditemukan", 404);
    }

    return rows;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumsService;
