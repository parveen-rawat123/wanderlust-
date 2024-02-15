const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
     type : String,
     required : true
    },
    description: String,

    image: {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
      }, 
       
    price : Number,
    location :String,
    country : String,
    Reviews :[
        {
          type : Schema.Types.ObjectId,
          ref : "Review"
    }
]
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
