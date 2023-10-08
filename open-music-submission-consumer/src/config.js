const dotenv = require('dotenv');

dotenv.config();

const config = {
  mailer: {
    smtpHost : process.env.SMTP_HOST,
    smtpPort : Number(process.env.SMTP_PORT),
    smtpUser : process.env.SMTP_USER,
    smtpPass : process.env.SMTP_PASSWORD,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_SERVER,
  },
  postgres: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
}

module.exports = config;
