const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const {promisify} = require('util')
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const createSendToken = (user, statusCode,message, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 *
            60 * 60 * 1000
        ),
        /* The `httpOnly: true` option in a cookie configuration ensures that the cookie is only
        accessible through HTTP requests and cannot be accessed via client-side scripts such as
        JavaScript. This helps to enhance the security of the cookie by preventing potential
        cross-site scripting (XSS) attacks where malicious scripts attempt to steal sensitive
        information stored in cookies. */
        httpOnly: true,
        
    }

    //the secure means only send cookie when we have https
  //  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    
    // to not show the password 
    user.password = undefined
     res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            user
        }
    });
}


exports.signup = catchAsync(async(req,res,next) =>{
    // specify the exact attribute you want so the user can not enter himself as role:admin
    const {name,email,password, passwordConfirm} =req.body

    // if(!name || !email || !password || !passwordConfirm) return next(new AppError('Please provide your information !', 400))


    userExist = await User.findOne({ email })
    if (userExist) return next(new AppError('User already exist!', 400))

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

     createSendToken(newUser,201,'user created successfully',res)
});


exports.login = catchAsync(async(req,res,next)=>{

    const {email,password} = req.body;

    // 1 check if email and password exist
    if (!email || !password) return next(new AppError('please provide email and password !', 400))
    
    
    //2 check if user exists && password is correct
    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password,user.password))) return next(new AppError('Incorrect email or password',401));


    console.log(user)
    createSendToken(user,200,'user logged in successfully',res)
    // 3) If everything ok, send token to client
 

})


exports.logout = catchAsync(async(req,res,next)=>{
    //as we cannot delete the cookie in the browser due to the httpOnly to true , we must send a false value to log out 
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true,
        })
        res.status(200).json({status:'success',message:'logged out successfully'})

})


exports.protect = catchAsync(async(req,res,next)=>{
    //1.get token and check if it's there

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
    
    console.log(token)
    console.log(req)

    if(!token) return next(new AppError('your are not logged in! Please log in to get access ;(', 401))

    //2. verify the token
    const decoded =await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    console.log(decoded)
    
    //3. check if user still exists
    //here we deal with the case the user was deleted after the token was created , then another user cannot grab this token and access 
    const freshUser = await User.findById(decoded.id);

    if(!freshUser) return next(new AppError('The user belonging to this token does no longer exist.'))

    //4. check if user changed password after the was token was issued.
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.',401))
        }

    req.user = freshUser;
    console.log(req.user)

    next()

})


exports.restrictTo = (...roles)=>{
    return (req,res,next) =>{
        //roles is an array of roles
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
        }
    }
    // usuallly cannot pass argument to middleware 
    // but for doing that , do a wrapper function , and return 
    // the normal middleware 
    

exports.forgotPassword = catchAsync(async(req,res,next) =>{

    //1 Get user based on Posted email
    const {email} =req.body

    if(!email) return next(new AppError('Please provide your email address'),400)

    const user = await User.findOne({email})
    if(!user) return next(new AppError("There is no user with email address", 404));

    //2 Generate the random token
    const resetToken = user?.createPasswordResetToken();
    await user.save({validateBeforeSave: false}); // we dont want to run the middleware here , bc it deactivate all validator here


    //3 Send it to user's email
    //user should click to this url in order to reset pswd
    const resetURL =`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message  = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\nIf you didn't forget your password , please ignore this email!`;
    

    try{

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token is valid for 10 minutes.',
            message
        });
        
        
        res.status(200).json({
            status:'success',
            message: 'Token sent to email'
            
        })
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('Error sending email. Try again later!'),500);

    }

})

exports.resetPassword =catchAsync(async(req,res,next) =>{

    //1 Get user based on the token, and compare(must crypt) it to encrypted saved in db
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
    
    const user = await User.findOne({passwordResetToken:hashedToken , passwordResetExpires :{$gt:Date.now()}})

     //2 set new password if token has not expired , and there is user, set the new password 

     if(!user) return next(new AppError('Token is invalid or has expired',400))

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken =undefined
    user.passwordResetExpires =undefined
    await user.save() // we want to run validator to confirm

    //for pswd always run save() instead of findandupdate

    //3 update changedPasswordAt property for the user
    //4 Log the user in , send JWT
    const token = signToken(user._id);

    createSendToken(user,200,'user password reset successfully',res)

})


exports.updatePassword = catchAsync( async (req,res , next) =>{

    const {passwordCurrent,password,passwordConfirm} = req.body

    if(!passwordCurrent || !password || !passwordConfirm) return next(new AppError('Please provide your current password or new password',400))

    //1 Get user from collection 
    const user = await User.findById(req.user.id).select('+password')

    //2 check if Posted current password is correct

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    
        return next(new AppError('your current paswword is wrong' , 401))
    }

    //3 if correct , update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save() // we want to run validator to confirm

    // 4 Log user in , send JWT 
    createSendToken(user,200,'user successfully updated the password',res)
})