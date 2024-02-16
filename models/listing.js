const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const listingSchema = new Schema({
    title : {
     type : String,
     required : true
    },
    description: String,

    image: {
        url: {
          type: String,
          required: true
        },
        filename: {
          type: String,
          required: true
        },
      }, 
       
    price : Number,
    location :String,
    country : String,
    review :[
        {
          type : Schema.Types.ObjectId,
          ref : "review"
    }
]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id :{$in : listing.review} })
  }
})


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
