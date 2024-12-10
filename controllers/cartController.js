const Menu = require('./../models/menuModel')
const APIFeatures = require('./../utils/apiFeatures')  
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')


exports.addToCart =  catchAsync(async (req, res, next) => {
    const id = req.params.id    
     
        const menu = await Menu.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if(!menu) return next(new AppError('No menu found with that ID', 404))

        res.status(200).json({
            status: 'success',
            data: menu
        })
})

exports.removeAllFromCart =catchAsync(async (req, res, next) => {

})


exports.getCartMenus= catchAsync(async (req, res, next) => {})


exports.updateQuantity = catchAsync(async (req, res, next) => {})