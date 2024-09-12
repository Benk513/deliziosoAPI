const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router();

//this is a unique route , only post allowed 
router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.route('/').get(userController.getAllUsers)

module.exports = router;