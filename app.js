const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
 console.log("connected to DB")
})
.catch((err)=>{
  console.log(err)
});

async function main(){
    await mongoose.connect(MONGO_URL)
};


app.get("/testListing", async (req,res)=>{
      let sampleListing = new listing({
        title : "my new Villa",
        description : "by the beach",
        price : 1200,
        location : "calnugute,goa",
        country : "india",
      });
      await sampleListing.save();
      console.log("sample was save")
      res.send("successfull testing")
});



app.get("/",(req,res)=>{
    res.send("hello i'm root")
})

app.listen(8080 ,()=>{
    console.log("server on listening on port 8080")
})