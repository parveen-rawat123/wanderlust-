const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js");
//index route


router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allisting = await listing.find({});
    res.render("./listing/index.ejs", { allisting });
  })
);

//new  listing
router.get("/new",isLoggedIn, (req, res) => {
  res.render("./listing/new.ejs");
});


//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listinginfo = await listing.findById(id)
    .populate({
      path : "review",
      populate : {
      path: "author",
    }
  })
    .populate("owner");
    if (!listing) {
      req.flash("error", "listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listinginfo });
  })
);

//crete route
router.post(
  "/new",
  isLoggedIn,
  validatelisting,
  wrapAsync(async (req, res, next) => {
    let newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(async  (req, res) => {
    let { id } = req.params;
    const listingedit = await listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("./listing/edit.ejs", { listingedit });
  })
);

// update route
router.put(
  "/:id",
   isLoggedIn,
   isOwner,
  validatelisting,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let url = req.body.listing.image;
    let filename = "myimage";
    req.body.listing.image = { url, filename };     
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletelisting = await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
