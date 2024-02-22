const listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allisting = await listing.find({});
  res.render("./listing/index.ejs", { allisting });
};

// searchwala

module.exports.filterbycity = async (req, res) => {
  let cityval = req.query.inputval.toLowerCase(); 
  let findval = await listing.find({ country : cityval});
  res.render("./listing/search.ejs", {findval});
};




// let cityval = req.query.inputval;  
//  console.log(cityval) 
// let filtervalue = allisting.filter( Element=>{Element.location===cityval   }) 
//   res.render("./listing/search.ejs")






module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listinginfo = await listing
    .findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listinginfo });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  await newlisting.save();
  console.log(newlisting)
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listingedit = await listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }

  let origonalImageUrl = listingedit.image.url;
  origonalImageUrl = origonalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listing/edit.ejs", { listingedit, origonalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.distroyListing = async (req, res) => {
  let { id } = req.params;
  let deletelisting = await listing.findByIdAndDelete(id);
  console.log(deletelisting);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};
