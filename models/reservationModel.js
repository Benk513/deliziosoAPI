const mongoose = require('mongoose')
const validator =require ('validator')

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,         
        required: [true, 'A reservation must have a name'],
        
        trim: true,
        maxlength: [40, 'A reservation name must have less or equal then 40 characters'],
        minlength: [3, 'A reservation name must have more or equal then 4 characters'],
        validate: [validator.isAlpha , 'a menu name must only contain characters ']
    },
    email: {
        type:String , 
        required:[true, 'Please provide your email'],
        unique:true,
        trim:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'A reservation should be made by a user']
    },
    phone: {
        type: String,
        required: [true, 'A reservation must have a phone number'],
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
    },
    seats:{
        type: Number,
        default: 1
    },
    status:{
        type:String,
        Enum:['pending', 'confirmed', 'completed', 'canceled'],
        default:'pending'
    }
,
    tableNumber:Number
},
{
    timestamps: true
}
)

const Reservation = mongoose.model('Reservation',reservationSchema)

module.exports = Reservation