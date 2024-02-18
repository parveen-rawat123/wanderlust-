const express = require("express")
const router  = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")
const listing = require("../models/listing.js");
const {validatereview, isLoggedIn,isReviewAuthor} = require("../middleware.js")




//post  review route
router.post("/",
isLoggedIn,
validatereview,
wrapAsync( async (req, res) => {
    let listingp = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listingp.review.push(newreview);
    await newreview.save()
    await listingp.save();
    req.flash("success","new review created")
    res.redirect(`/listings/${req.params.id}`);  
  }));
  
  
  //delete  review route 
  router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
  wrapAsync
  (async(req,res)=>{
    let { id ,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{review : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted")
   res.redirect(`/listings/${id}`)
  }));
  
  module.exports = router;