const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')
const router = express.Router({mergeParams:true})

//this will protect all the routes downwards
router.use(authController.protect)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('customer'),
    reviewController.createReview)


module.exports =router;