const mongoose = require('mongoose')
const Menu = require('./menuModel')

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
    },


},{
    //what do toJSON and toObject do in the schema?
    
    /* The `toJSON:{virtuals:true}` and `toObject:{virtuals:true}` options in the schema are used to
    ensure that virtual properties are included when converting a document to a JSON object or a
    plain JavaScript object using the `toJSON()` and `toObject()` methods, respectively. */
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.pre(/^find/, function(next){
    // this.populate(
    //     {
    //         path:'menu',
    //         select:'name price'
    //     }
    // ).populate({
    //     path:'user',
    //     select:'name'
    // })
    this.populate(
        {
            path:'user',
            select:'name'
        }
    )

    next()
})

//
reviewSchema.statics.calcAverageRatings = async function(menu){
  const stats = await this.aggregate([
        {
            $match:{menu:menu},
        },
        {   
            $group:{_id:'$menu',nRating:{$sum:1},avgRating:{$avg:'$rating'}}
        }
       
    ])

    console.log(stats)
    // we save the stats to the current menu 
    if(stats.length > 0){

        await Menu.findByIdAndUpdate(menu,{
            // je fais la liason avec les fields du menu pour ajouter mes valeurs 
            ratingsAverage : stats[0].avgRating,
            ratingsQuantity :stats[0].nRating
        })
    }else
    {
        await Menu.findByIdAndUpdate(menu,{
            // je fais la liason avec les fields du menu pour ajouter mes valeurs 
            ratingsAverage : 4.5,
            ratingsQuantity :0
        })
    }     
}


reviewSchema.post('save', function(){
    // here is where we call the method on the Model
    this.constructor.calcAverageRatings(this.menu)
    // this.constructor is the model

})

/* The line `reviewSchema.index({user:1 , menu:1} ,{unique:true})` in the schema is creating a compound
index on the `user` and `menu` fields of the `Review` model. as this allows the uniqueness of the fields */
reviewSchema.index({user:1 , menu:1} ,{unique:true})


//these middleware help update and delete reviews 

/* The `reviewSchema.pre(/^findOneAnd/, async function(next){ this.r = await this.findOne(); next() })`
middleware function is a pre-hook that is executed before any `findOneAndX` operation (e.g.,
`findOneAndUpdate`, `findOneAndDelete`) on a document in the `Review` model. */
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next()
})

// i wrote post because i want to do calculation after the doc was updated or deleted
reviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcAverageRatings(this.r.menu)
    // this.r is the document that was found
    })


// it is actually used to display virtual properties used to calculate some fields value but not saved to dbs
const Review = mongoose.model('Review', reviewSchema)

module.exports =Review;

 
// user_id (Foreign Key to User.id)
// menu_item_id (Foreign Key to Menu.id)
// created_at (Timestamp)
// updated_at (Timestamp)
