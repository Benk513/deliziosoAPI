const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({

    review :{
        type:String,
        trim:true
    },
    rating:{
        type: Number,
        min:[1 ,'the rating must be at least 1'],
        max:[5 , 'the rating must be less or equal to 5']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    

    updatedAt:Date,
    menu :{
        type:mongoose.Schema.ObjectId,
        ref:'Menu',
        required:[true, 'Review must belong to a menu']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'Review must belong to a user']
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports =Review;

 
// user_id (Foreign Key to User.id)
// menu_item_id (Foreign Key to Menu.id)
 
 
// created_at (Timestamp)
// updated_at (Timestamp)