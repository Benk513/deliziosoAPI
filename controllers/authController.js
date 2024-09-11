const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.signup = catchAsync(async(req,res,next) =>{
    // specify the exact attribute you want so the user can not enter himself as role:admin
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });

    const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET ,{expiresIn:process.env.JWT_EXPIRES_IN})

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    })
});