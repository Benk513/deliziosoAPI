const catchAsync = require('../utils/catchAsync')
const Review = require('./../models/reviewModel')



exports.getAllReviews = catchAsync(async (req,res,next)=>{
    let filter = {}

    if(req.params.menuId) filter = {menu:req.params.menuId}

    const reviews = await Review.find(filter)
    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:reviews
        })  
})



exports.createReview =catchAsync(async(req,res,next)=>{

    if(!req.body.menu) req.body.menu = req.params.menuId
    if(!req.body.user) req.body.user = req.user.id
    const review = await Review.create(req.body)
    res.status(201).json({
        status:' success',
        data:review
        })
})

exports.deleteReview =catchAsync(async(req,res,next)=>{
    await Review.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status:'success',
        data:null
        })
})