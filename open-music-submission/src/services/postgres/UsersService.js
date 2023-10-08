const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { pool } = require('./pool');
const { AuthenticationError } = require('../../commons/exceptions');

class UsersService {
  constructor() {
    this._pool = pool;
    this._bcrypt = bcrypt;
  }

  async persistUser({ username, password, fullname }) {
    const id = `users-${nanoid(16)}`;

    const hashedPassword = await this._bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, hashedPassword, fullname],
    };

    await this._pool.query(query);

    return id;
  }

  async isUsernameExist(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    return !!result.rows.length;
  }

  async getUserByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('kredensial yang Anda berikan salah');
    }

    return result.rows[0];
  }

  async comparePassword(hashedPassword, password) {
    return this._bcrypt.compare(password, hashedPassword);
  }
}

module.exports = UsersService;
