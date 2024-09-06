const mongoose = require('mongoose')
const validator =require ('validator')

const menuSchema =new mongoose.Schema({
    imageURL: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,         
        required: [true, 'A menu must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [4, 'A tour name must have more or equal then 4 characters'],
        validate: [validator.isAlpha , 'a menu name must only contain characters ']
    },
    
    category: {
        type: String,
        trim: true,
        required: [true, 'A menu must have a category'],
    },

    description: {
        type: String,
        trim: true,
        required: [true, 'A menu must have a description']
    },

    ingredients: [String],

    price: {
        type: Number,
        required: [true, 'A menu must have a price']
      },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    rating: Number,
    //reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
      },
  

    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now },

    availability:Boolean
 
})
const Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu