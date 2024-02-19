const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//index route
router.get("/", wrapAsync(listingController.index));

//new  listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//crete route
router.post(
  "/new",
  isLoggedIn,
  validatelisting,
  wrapAsync(listingController.createListing)
);

// edit route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validatelisting,
  wrapAsync(listingController.updateListing)
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.distroyListing)
);

module.exports = router;
