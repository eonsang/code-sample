require('dotenv').config();

const env = process.env;

const development = {
  username: env.DB_DEV_USERNAME,
  password: env.DB_DEV_PASSWORD,
  database: env.DB_DEV_DATABASE,
  host: env.DB_DEV_HOST,
  dialect: env.DB_DEV_DIALECT,
  port: env.DB_DEV_PORT,
  logging: false
};


module.exports = { development };
