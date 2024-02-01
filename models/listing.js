const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
     type : String,
     required : true
    },
    description: String,

    image: {
        type: String,
        default : "https://unsplash.com/photos/the-sun-is-setting-over-a-rocky-landscape-MV7iHCilMJc",
        set: function (v) {
            if (typeof v === 'object' && v.url) {
                return v.url;
            } else if (v === "") {
                return "https://unsplash.com/photos/the-sun-is-setting-over-a-rocky-landscape-MV7iHCilMJc";
            } else {
                return v;
            }
        }
    },
    
    price : Number,
    location :String,
    country : String,
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
