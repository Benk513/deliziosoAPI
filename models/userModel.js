const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({ 
    name: {
        type:String,
        required:[true, 'Please tell us your name !']
    },
    email:{
        type:String , 
        required:[true, 'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength: 8,
        // false to never show to client
        select:false

    },
    passwordConfirm:{type:String,
        required:[true,'Please confirm your password'],
        validate:{
            // say this function will only execute on CREATE and SAVE
            validator:function(el){
                return el ===this.password;
            },
            message:'Password are not the same !'
        }
      
    },
     
})

// mongoose middleware to run b4 save
userSchema.pre('save' , async function(next){
    // only run when password modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    //here no need to save passwordConfirm it is required solely for confirmation set to undefined to not save it to db
    this.passwordConfirm = undefined;
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User