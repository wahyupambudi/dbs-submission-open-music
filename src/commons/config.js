const dotenv = require("dotenv");

dotenv.config();

const config = {
  // sudah di definisikan di dalam environment variabel .env
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },

  // sudah di definisikan di dalam environment variabel .env
  postgres: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGNAME,
    username: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD,
  },
};

module.exports = { config };
