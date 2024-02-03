const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listings = require("./models/listing.js");
const path = require("path");
const listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


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
  res.render("./listing/index.ejs",{allisting})
});

//new  listing 

app.get("/listings/new", (req,res)=>{
  res.render("./listing/new.ejs")
});



//show route
app.get("/listings/:id", async (req,res)=>{
      let {id} = req.params;
   const listinginfo =  await listing.findById(id);
res.render("./listing/show.ejs", {listinginfo})
});



// edit route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} = req.params;
  const listingedit = await listing.findById(id);
   res.render("./listing/edit.ejs" ,{listingedit})
});


// update route
app.put("/listings/:id", async (req,res)=>{
  let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`)
});

//delete route
app.delete("/listings/:id",async(req,res) =>{
  let {id} = req.params;
    let deletelisting = await listing.findByIdAndDelete(id)
    res.redirect("/listings")
    console.log(deletelisting)
});





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