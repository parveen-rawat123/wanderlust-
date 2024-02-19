const listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allisting = await listing.find({});
  res.render("./listing/index.ejs", { allisting });
};

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
  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
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
  res.render("./listing/edit.ejs", { listingedit });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // let url = req.body.listing.image;
  // let filename = "myimage";
  // req.body.listing.image = { url, filename };
  let listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
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
