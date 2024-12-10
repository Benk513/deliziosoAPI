const MenuRepo = require("../repositories/menu.repo")

const MenuService = {
    async createMenu(data) {
        await MenuRepo.createMenu(data)
    }
}

module.exports = MenuService