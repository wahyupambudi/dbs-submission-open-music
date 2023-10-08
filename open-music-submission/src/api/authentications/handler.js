const {
  AuthenticationError,
  InvariantError,
} = require('../../commons/exceptions');

class AuthenticationsHandler {
  constructor(validator, authenticationsService, usersService, tokenManager) {
    this._validator = validator;
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
  }

  async postAuthenticationHandler(request, h) {
    const {
      username,
      password,
    } = this._validator.validatePostAuthenticationPayload(request.payload);

    const {
      id: userId,
      password: hashedPassword,
    } = await this._usersService.getUserByUsername(username);

    const match = await this._usersService.comparePassword(hashedPassword, password);

    if (!match) {
      throw new AuthenticationError('kredensial yang Anda berikan salah');
    }

    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    const { refreshToken } = this._validator.validatePutAuthenticationPayload(request.payload);
    const isExists = await this._authenticationsService.isRefreshTokenExists(refreshToken);

    if (!isExists) {
      throw new InvariantError('refresh token tidak valid');
    }

    const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ userId });

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const { refreshToken } = this._validator.validateDeleteAuthenticationPayload(request.payload);
    const isExist = await this._authenticationsService.isRefreshTokenExists(refreshToken);

    if (!isExist) {
      throw new InvariantError('refresh token tidak valid');
    }

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
