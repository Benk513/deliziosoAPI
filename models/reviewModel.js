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

    updatedAt:Date
    
})

const Review = mongoose.model('Review', reviewSchema)


 
// user_id (Foreign Key to User.id)
// menu_item_id (Foreign Key to Menu.id)
 
 
// created_at (Timestamp)
// updated_at (Timestamp)