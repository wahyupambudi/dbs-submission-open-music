const routes = require('./routes');
const AuthenticationsHandler = require('./handler');
const AuthenticationsValidator = require('./validator');

const authentications = {
  name: 'authentications',
  register: async (server, {
    authenticationsService, usersService, tokenManager,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      AuthenticationsValidator,
      authenticationsService,
      usersService,
      tokenManager,
    );
    server.route(routes(authenticationsHandler));
  },
};

module.exports = authentications;
