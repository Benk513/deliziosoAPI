const express = require('express')
const menuController = require('./../controllers/menuController')
const getFeaturedMenus = require('./../controllers/menuController')
const authController = require('./../controllers/authController')
const reviewRouter =require('./../routes/reviewRoutes')
const router = express.Router()

router.route('/featured').get(menuController.getFeaturedMenus)
router.route('/recommandation').get(menuController.getMenusByCategory)
router.route('/category/:category').get(menuController.getRecommandedMenus)

router
  .route('/')
  .get(authController.protect,authController.restrictTo('admin','manager','customer'),menuController.getAllMenus)
  .post(menuController.createMenu);
  
router.route('/:id')
    .get(menuController.getMenu)
    .patch(menuController.updateMenu)
    .patch(menuController.toggleFeaturedMenus)
    .delete(authController.restrictTo('admin', 'manager'),menuController.deleteMenu)

router.use('/:menuId/reviews',reviewRouter)
module.exports = router;