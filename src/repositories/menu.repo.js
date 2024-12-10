const Menu = require('../../models/menuModel');
const AppError = require('../../utils/appError');
const { HttpStatusCode } = require('../dto/axios');

const MenuRepo = {
  async createMenu(data) {
    try {
      await Menu.create(data);
    } catch (error) {
      throw new AppError('create error', HttpStatusCode.InternalServerError);
    }
  },
};

module.exports = MenuRepo;
