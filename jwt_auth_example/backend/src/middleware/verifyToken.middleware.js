const jwt = require('jsonwebtoken');
const exception = require('../utils/exception');

require('dotenv').config();

async function verifyTokenMiddleware(req, res, next) {
  try {
    if( req.headers && req.headers['authorization'] ) {
      // Bearer 제거
      const token = req.headers['authorization'].split(' ')[1];

      // request 객체에 user정보 추가
      req.user = await jwt.verify(token, process.env.SECRET_KEY);
      return next();
    }

    return next(exception(400, 'token이 없습니다.'));
  }
  catch(error) {
    return next(exception(401, error.message));
  }
};

module.exports = verifyTokenMiddleware;
