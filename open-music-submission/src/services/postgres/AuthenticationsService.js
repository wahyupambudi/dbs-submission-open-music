const { pool } = require('./pool');

class AuthenticationsService {
  constructor() {
    this._pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

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
