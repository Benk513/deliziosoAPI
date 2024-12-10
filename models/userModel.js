const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name !']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        // false to never show to client
        select: false

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // say this function will only execute on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same !'
        }

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            menu: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
            }
        }],
        favoriteMenus:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                }
        ],
    role: {
        type: String,
        enum: ["customer", "manager", "admin"],
        default: "customer"
    },
    // i define the geoLocation props, by specifyng an array , it will create a new embedded doc in the parent doc , they will get each an _id
    location: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
            },
            description: String,
            address:String
        },
], 
    bio: {
        type: String,
        default: '-'
    },
    phone: {
        type: String,
        default: '-'
    },

    active: {
        type: Boolean,
        default: true,
        select: false
    }

},
    {
        timestamps: true
    })

// ******** MIDDLEWARES ************* 

// mongoose middleware to run b4 save
userSchema.pre('save', async function (next) {
    // only run when password modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    //here no need to save passwordConfirm it is required solely for confirmation set to undefined to not save it to db
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000;
    next()

})
userSchema.pre(/^find/, function () {
    this.find({ active: { $ne: false } })
    // this is to find all users except the one who is currently logged in
})

// ******** MIDDLEWARES ************* 


//this is an instance methode for the model and is available for all docs
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < passwordChangedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordResetToken = function () {

    // we create this token to send to user in email 
    // we must encrypt this so the hacker cannot access this 
    //bcoz he can use it to get the account 

    const resetToken = crypto.randomBytes(32).toString('hex');

    //encrypting the token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // expires in 10 min

    return resetToken;

}

const User = mongoose.model('User', userSchema)

module.exports = User