const express = require("express")
const router  = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js")
const listing = require("../models/listing.js");


const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(400, errmsg)
    }
    else {
      next()
    }
  };
  


//post  review route
router.post("/",validatereview,wrapAsync( async (req, res) => {
    let listingp = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listingp.review.push(newreview);
    await newreview.save()
    await listingp.save();
    req.flash("success","new review created")
    res.redirect(`/listings/${req.params.id}`);  
  }));
  
  
  //delete  review route 
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let { id ,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{review : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted")
   res.redirect(`/listings/${id}`)
  }));
  
  module.exports = router;