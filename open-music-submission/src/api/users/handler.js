const { InvariantError } = require('../../commons/exceptions');

class UsersHandler {
  constructor(validator, usersService) {
    this._validator = validator;
    this._usersService = usersService;
  }

  async postUserHandler(request, h) {
    const userPayload = this._validator.validatePostUsersPayload(request.payload);
    const isUsernameExist = await this._usersService.isUsernameExist(userPayload.username);

    if (isUsernameExist) {
      throw new InvariantError('username sudah digunakan.');
    }

    const userId = await this._usersService.persistUser(userPayload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
