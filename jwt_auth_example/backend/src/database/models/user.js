const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
    }

    // 비밀번호 확인
    async comparePassword (password) {
      const result = await bcrypt.compare(password, this.password);
      console.log(result);
      return result;
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      require: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      require: true
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      require: false
    }
  }, {
    sequelize,
    modelName: 'User'
  });

  /**
   * 유저가 생성되기 전에 비밀번호 해시
   * */
  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 12);
  });

  return User;
};

