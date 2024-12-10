const User =require('./../models/userModel') 
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer')

const multerStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/images/users')
    },
    filename:(req,file, cb) =>{
        const ext = file.mimetype.split('/')[1]
        //cb(null, `${Date.now()}.${ext}`)}
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)}
})

const multerFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else
    {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}


const upload = multer( {
    storage: multerStorage,
    fileFilter: multerFilter,

})


const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;

}

exports.uploadUserPhoto = upload.single('file')

exports.getAllUsers =async(req, res, next) =>{

   const users = await User.find()

    res.status(200).json({
        status: 'success',
        results:users.length,
        data:users
    })

}

exports.uploadPhoto =  catchAsync(async(req,res,next) =>{
    const user = await User.findByIdAndUpdate(req.params.id, { photo: req.file.filename }, {
        new: true,
        runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: user
        })
        
})

exports.getMe = catchAsync( async(req,res,next)=>{
   
        const user = await User.findById(req.user.id)
        res.status(200).json({
            status:'success',
            data:user
                    })
         
})

// update me (profile)
exports.updateMe =async(req,res,next) =>{
       //1 create error if user Posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatepassword.', 400))
    }

    //2 UPdate user document 

    //const user = await User.findById(req.user.id)
    // in this way it will not work bcause need validation for every steps of them  , then use findByIdAndUpdate , for sensitive data 
    // of course you will pass by save()
    // user.name ='ben'
    // user.save()

    // this function allow to filter parameter from the req.body bcoz we do not want the user to change his status by himself
    // 2) filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filteredObj(req.body, 'name', 'email','bio')

    if(req.file) filteredBody.photo = req.file.filename;


    //3 update user doc
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, // new means will create a new document and kill the previous one
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data:{
            user:updatedUser
        }
    })

}

exports.deleteMe =catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})
    
    res.status(204).json({
        status: 'success',
        data:null
        })

})
// get one user
// update one user
// delete one user