const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));


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



//index route
app.get("/listings", async (req,res)=>{
  let  allisting =  await listing.find({})
  res.render("C:/Desktop/MajorProject/views/listing/index.ejs",{allisting})
});

//new  listing 
app.get("/listing/new", (req,res)=>{
  res.render("C:/Desktop/MajorProject/views/listing/new.ejs")
})



//show route
app.get("/listings/:id", async (req,res)=>{
      let {id} = req.params;
   const listinginfo =  await listing.findById(id);
res.render("C:/Desktop/MajorProject/views/listing/show.ejs", {listinginfo})
})













// app.get("/testListing", async (req,res)=>{
//       let sampleListing = new listing({
//         title : "my new Villa",
//         description : "by the beach",
//         price : 1200,
//         location : "calnugute,goa",
//         country : "india",
//       });
//       await sampleListing.save();
//       console.log("sample was save")
//       res.send("successfull testing")
// });



app.get("/",(req,res)=>{
    res.send("hello i'm root")
})

app.listen(8080 ,()=>{
    console.log("server on listening on port 8080")
})