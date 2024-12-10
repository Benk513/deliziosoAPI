const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router();

// -----------------AUTHENTICATION--------------------------
//this is a unique route , only post allowed 
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
router.patch('/updateMyPassword',authController.protect, authController.updatePassword)

// -----------------USER PROFILE--------------------------

router.use(authController.protect)
router.get('/me', userController.getMe)
router.patch('/updateMe',  userController.uploadUserPhoto,userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

// -----------------ADMIN ROUTES--------------------------

router.route('/').get(userController.getAllUsers)
router.use(authController.restrictTo('admin'))


//  get all the reservations for a user by his Id
// router.use('/:userId/reservations',reservationRouter)
module.exports = router;