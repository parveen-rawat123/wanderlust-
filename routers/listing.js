const express = require("express")
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../models/listing.js");
//index route


const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errmsg)
  }
  else {
    next()
  }
};




router.get("/", wrapAsync(async (req, res) => {
    let allisting = await listing.find({})
    res.render("./listing/index.ejs", { allisting })
  }));
  
   
  //new  listing 
  router.get("/new", (req, res) => {
    res.render("./listing/new.ejs")
  });
  
  
  //show route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listinginfo = await listing.findById(id).populate("review");
    if(!listing){
         req.flash("error","listing you requested does not exist");      
         res.redirect("/listings")
    }
    res.render("./listing/show.ejs", { listinginfo })
  }));
  
  
  //crete route 
  router.post("/new", validatelisting, wrapAsync(
    async (req, res, next) => {
      let newlisting = new listing(req.body.listing);
      await newlisting.save();
      req.flash("success","new listing created")
      res.redirect("/listings")
    })
  );
  
  
  // edit route
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingedit = await listing.findById(id);
    if(!listing){
      req.flash("error","listing you requested does not exist");      
      res.redirect("/listings")
 }
    res.render("./listing/edit.ejs", { listingedit })
  }));
  
  
  // update route
  router.put("/:id",
    validatelisting, wrapAsync(async (req, res) => {
      let { id } = req.params;
      let url = req.body.listing.image;
      let filename = "myimage"
      req.body.listing.image = {url,filename}
      await listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success","listing updated")
      res.redirect(`/listings/${id}`)
    }));
  
  
  //delete route
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletelisting = await listing.findByIdAndDelete(id)
    console.log(deletelisting)
    req.flash("success","listing deleted")
    res.redirect("/listings")
  }));
  
  module.exports = router;