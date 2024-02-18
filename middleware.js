const Listing = require("./models/listing");
const review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are not owner of this listing")
     return res.redirect(`/listings/${id}`)
    }
    next()
};

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };
  
 module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(400, errmsg)
    }
    else {
      next()
    }
  };
  
  module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id , reviewId } = req.params;
    let reviews = await review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
      req.flash("error","you did not create this review")
     return res.redirect(`/listings/${id}`)
    }
    next()
};
