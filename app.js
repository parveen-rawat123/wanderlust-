if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/reviews.js")
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routers/user.js");
const listing = require("./models/listing");
const wrapAsync = require('./utils/wrapAsync.js');
const { env } = require('process');
const { log } = require('console');
const dbUrl =process.env.ATLASDB_URL;


async function main() {
  await mongoose.connect(dbUrl)
  .then(()=>{
    console.log("connection success")
  })
  .catch((e)=>{
    console.log("connection feild")
  })
};


main()
  .then(() => {
    console.log("connected to DB")
  })
  .catch((err) => {
    console.log(err)
  });

  

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



const sessionoptions = {
  secret : "mysupersecret",
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 1000, 
    maxAge :  7 * 24 * 60 * 1000,
    httpOnly : true
  },
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next()
});




// app.get("/demouser",async (req,res)=>{
//  let fakeuser = new User({
//     email : "student@gamil.com",
//     username : "delta-student"
//  })

//  let registeredUser  = await User.register(fakeuser,"helloworld");
//  res.send(registeredUser);
// });


app.use("/listings", listingsRouter)
app.use("/listings/:id/review", reviewRouter);
app.use("/",userRouter)


// search route
app.get("/search", async (req, res) => {
  let value = req.query.inputval;
  let findval;

   if (!value || value.trim() === "") {
     res.redirect("/listing/index.ejs");
  }
  if (!isNaN(value)) {
    findval = await listing.find({ price: { $eq: parseInt(value) } });
  } else {
    findval = await listing.find({
      $or: [
        { country: { $regex: value, $options: "i" } },
        { location: { $regex: value, $options: "i" } },
        { title: { $regex: value, $options: "i" } },
      ],
    });
  }
if(findval.length===0){
  res.render("./listing/notsearch.ejs")
}else{
  res.render("./listing/search.ejs", { findval });
}
});


// error handling for all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"))
});

//error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./listing/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server on listening on port 8080")
})

