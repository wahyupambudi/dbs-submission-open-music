const AlbumsHandler = require('./handler');
const AlbumsValidator = require('./validator');
const routes = require('./routes');

const albums = {
  name: 'albums',
  register: async (server, { albumsService, storageService, userAlbumLikesService }) => {
    const handler = new AlbumsHandler(
      AlbumsValidator,
      albumsService,
      storageService,
      userAlbumLikesService,
    );

    server.route(routes(handler));
  },
};

module.exports = albums;
