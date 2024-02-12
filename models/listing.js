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
        default:"https://images.unsplash.com/photo-1573561507036-b0110570e2e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3Vuc2V0JTIwYmVhY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
        set: (v)=> v ==="" ? "https://images.unsplash.com/photo-1573561507036-b0110570e2e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3Vuc2V0JTIwYmVhY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" : v,
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
