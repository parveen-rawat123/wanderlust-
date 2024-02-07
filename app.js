const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listings = require("./models/listing.js");
const path = require("path");
const listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const  {listingSchema}= require("./schema.js");
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

const validatelisting = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body);
 if(error){
  let errmsg = error.details.map((e)=> e.message).join(",");
  throw new ExpressError(400,errmsg)
 }
 else{
  next()
 }
};



//index route
app.get("/listings",wrapAsync( async (req,res)=>{
  let  allisting =  await listing.find({})
  res.render("./listing/index.ejs",{allisting})
}));

//new  listing 
app.get("/listings/new", (req,res)=>{
  res.render("./listing/new.ejs")
});


//show route
app.get("/listings/:id",wrapAsync( async (req,res)=>{
      let {id} = req.params;
   const listinginfo =  await listing.findById(id);
res.render("./listing/show.ejs", {listinginfo})
}));

//crete route 
app.post("/listings/new",validatelisting, wrapAsync(
 async (req,res,next)=>{
    let newlisting =new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
})
);


// edit route
app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
  let {id} = req.params;
  const listingedit = await listing.findById(id);
   res.render("./listing/edit.ejs" ,{listingedit})
}));


// update route
app.put("/listings/:id",
 validatelisting, wrapAsync( async (req,res)=>{
  let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`)
}));
   
//delete route
app.delete("/listings/:id",wrapAsync( async(req,res) =>{
  let {id} = req.params;
    let deletelisting = await listing.findByIdAndDelete(id)
    res.redirect("/listings")
    console.log(deletelisting)
}));

// error handling for all route
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found"))
});



//error handler
app.use((err,req,res,next)=>{
let {statusCode=500,message= "something went wrong"} = err;
res.status(statusCode).render("./listing/error.ejs",{message});
});




app.get("/",(req,res)=>{
    res.send("hello i'm root")
})

app.listen(8080 ,()=>{
    console.log("server on listening on port 8080")
})