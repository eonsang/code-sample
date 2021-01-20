const jwt = require('jsonwebtoken');

const authRepo = require('./auth.repository');
const response = require('../../utils/response');
const exception = require('../../utils/exception');

require('dotenv').config();

module.exports = {
  // 회원가입
  signUp: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existUser = await authRepo.findByUsername(username);
      if( existUser ) {
        return next(exception(409, '아이디 중복'));
      }

      const user = await authRepo.create({username, password});

      return response(res, 201, true, {
        user
      });
    } catch(error) {
      return next(error)
    }
  },

  // 로그인
  signIn: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existUser = await authRepo.findByUsername(username);
      if( !existUser ) {
        return next(exception(404, '회원 조회 실패'));
      }

      // comparePassword 메소드느 sequelize 인스턴스 메소드로 등록
      const isMatchPassword = await existUser.comparePassword(password);
      if(!isMatchPassword) {
        return next(exception(403, '비밀번호 불일치'));
      }

      const expiresIn = 2;
      const access_token = await jwt.sign({id: existUser.id, name: existUser.username}, process.env.SECRET_KEY, {
        expiresIn // 1시간
      });
      const refresh_token = await jwt.sign({id: existUser.id}, process.env.SECRET_KEY, {
        expiresIn: 10// 7일
      });

      // refresh_token 저장
      await authRepo.update(existUser.id, {
        refresh_token
      });

      return response(res, 200, true, {
        token_type: 'Bearer', // 토큰 타입
        expires_in: new Date().getTime() + expiresIn, // access_token 만료 시간
        access_token,
        refresh_token
      })
    }
    catch(error) {
      return next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      // Bearer 삭제
      const refreshToken = req.headers['refresh_token'].split(' ')[1];
      if(!refreshToken) {
        return next(exception(400, 'refresh_token이 없습니다.'));
      }

      const decoded = jwt.decode(refreshToken);
      if(!decoded || !decoded.id) {
        return next(exception(400, '잘못된 토큰입니다.'));
      }

      // 리프레시 토큰이 만료?
      const nowTime = new Date().getTime();
      if(nowTime > decoded.exp * 1000) {
        console.log('만료된');
        return next(exception(400, '만료된 토큰입니다.'));
      }

      const user = await authRepo.findById(decoded.id);
      if(!user) {
        return next(exception(404, '유저를 찾을수 없습니다.'));
      }

      const isMatchRefreshToken = user.refresh_token === refreshToken;
      if(!isMatchRefreshToken) {
        return next(exception(400, '토큰이 일치하지 않습니다.'));
      }
      const expiresIn = 2;
      const access_token = await jwt.sign({id: user.id, name: user.username}, process.env.SECRET_KEY, {
        expiresIn
      })

      return response(res, 200, true, {
        token_type: 'Bearer', // 토큰 타입
        expires_in: new Date().getTime() + expiresIn, // access_token 만료 시간
        access_token,
      })
    }
    catch(error) {
      console.log(error);
      return next(error);
    }
  },

  whoami: async (req, res, next) => {
    try {
      // verifyTokenMiddleware 에서 추가된 user 객체
      const { id } = req.user;
      const user = await authRepo.findById(id);

      return response(res, 200, true, {
        user
      })
    }
    catch(error) {
      return next(error);
    }
  }
};
