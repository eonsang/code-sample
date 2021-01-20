const { User } = require('../../database/models');

module.exports = {
  findById: async (id) => {
    return await User.findByPk(id);
  },
  findByUsername: async (username) => {
    return await User.findOne({
      where: {
        username
      }
    });
  },
  create: async (data) => {
    return await User.create(data);
  },
  update: async (id, data) => {
    return await User.update(data, {
      where: {
        id
      }
    });
  },
}
