const PlaylistsValidator = require('./validator');
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const playlists = {
  name: 'playlists',
  register: async (server, { playlistsService }) => {
    const playlistsHandler = new PlaylistsHandler(
      PlaylistsValidator,
      playlistsService,
    );
    server.route(routes(playlistsHandler));
  },
};

module.exports = playlists;
