const UsersHandler = require('./handler');
const UsersValidator = require('./validator');
const routes = require('./routes');

const users = {
  name: 'users',
  register: async (server, { usersService }) => {
    const handler = new UsersHandler(UsersValidator, usersService);
    server.route(routes(handler));
  },
};

module.exports = users;
