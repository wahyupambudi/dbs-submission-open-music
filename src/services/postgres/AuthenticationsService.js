const { pool } = require('./pool');

class AuthenticationsService {
  constructor() {
    this._pool = pool;
  }

  async addRefreshToken(token) {
    /**
     * 3. @TODO
     * buat variabel query untuk menyimpan query insert token ke dalam tabel authentications
     * gunakan argumen `token` untuk mengisi nilai pada kolom token
     *
     * Referensi: https://www.dicoding.com/academies/271/tutorials/17649
     */

    const query = // ... isi query insert ke dalam tabel authentications

    await this._pool.query(query);
  }

  async isRefreshTokenExists(refreshToken) {
    const query = {
      text: 'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    return !!result.rows.length;
  }

  async deleteRefreshToken(refreshToken) {
    await this._pool.query({
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    });
  }
}

module.exports = AuthenticationsService;
