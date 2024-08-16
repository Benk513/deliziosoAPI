const express = require('express')
const menuController = require('./../controllers/menuController')

const router = express.Router()

router
  .route('/')
  .get(menuController.getAllMenus)
    .post(menuController.createMenu);
  
router.route('/:id')
    .get(menuController.getMenu)
    .patch(menuController.updateMenu)
    .delete(menuController.deleteMenu)


module.exports = router;