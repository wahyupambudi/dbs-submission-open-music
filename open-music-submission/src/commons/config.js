const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config();

const config = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    imagesPublicPath: join(process.cwd(), 'src', 'public', 'images'),
    generateAlbumArtUrl: (albumId) => `http://${config.app.host}:${config.app.port}/albums/${albumId}/covers`,
  },
  postgres: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  jwtToken: {
    accessToken: {
      key: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? 3600,
    },
    refreshToken: {
      key: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? 36000,
    },
  },
  rabbitMq: {
    url: process.env.RABBITMQ_SERVER,
  },
  redis: {
    url: process.env.REDIS_SERVER,
  },
};

module.exports = { config };
