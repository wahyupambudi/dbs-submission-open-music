const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const { ClientError } = require('./commons/exceptions');
const { config } = require('./commons/config');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const users = require('./api/users');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const authentications = require('./api/authentications');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlists = require('./api/playlists');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const LocalStorageService = require('./services/storages/LocalStorageService');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');
const CacheService = require('./services/redis/CacheService');

async function createServer() {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: {
      request: ['error'],
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const tokenManager = new TokenManager();
  const playlistsService = new PlaylistsService();
  const storageService = new LocalStorageService();
  const cacheService = new CacheService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  await server.register([
    {
      plugin: Jwt.plugin,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: config.jwtToken.accessToken.key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwtToken.accessToken.expiresIn,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        storageService,
        userAlbumLikesService,
      },
    },
    {
      plugin: songs,
      options: {
        songsService,
      },
    },
    {
      plugin: users,
      options: {
        usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
      },
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        producerService: ProducerService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    return h.continue;
  });

  return server;
}

(async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
