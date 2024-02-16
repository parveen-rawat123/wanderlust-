const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routers/listing.js");
const review = require("./routers/reviews.js")



main()
  .then(() => {
    console.log("connected to DB")
  })
  .catch((err) => {
    console.log(err)
  });

async function main() {
  await mongoose.connect(MONGO_URL)
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


app.use("/listings", listings)
app.use("/listings/:id/review", review);




// error handling for all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"))
});

//error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./listing/error.ejs", { message });
});


app.get("/", (req, res) => {
  res.send("hello i'm root")
})

app.listen(8080, () => {
  console.log("server on listening on port 8080")
})

