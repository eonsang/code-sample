const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { sequelize } = require('./database/models');
const apiRouter = require('./api')
const response = require('./utils/response');
const exception = require('./utils/exception');

class App {
  constructor() {
    this.app = express();

    this.connectDatabase();

    this.setMiddleware();

    this.setRouter();

    this.setErrorhandler();
  }

  connectDatabase () {
    sequelize.sync({ force: false })
      .then(() => {
        console.log('DB 연결 성공');
      })
      .catch((error) => {
        console.log('DB 연결 실패' + error);
      });
  }

  setMiddleware() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  setRouter() {
    this.app.use('/api', apiRouter);
  }

  setErrorhandler() {
    this.app.use((req, res, next) => {
      return next(exception(404, 'NOT FOUND'));
    });
    this.app.use((err, req, res, next) => {
      if (!err.status) {
        err = {
          status: 500,
          message: 'SERVER ERROR'
        }
      }

      return response(res, err.status, false, {
        message: err.message
      })
    })
  }
}

module.exports = new App().app;
