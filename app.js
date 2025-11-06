if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const data = require("./init/data.js");
const path = require("path");
const ejsMate = require("ejs-mate");
var methodOverride = require("method-override");
const ExpressError = require("./uitls/ExpressError.js");
// const wrapAsync = require("./uitls/wrapAsync.js");
// const { listingSchema, reviewSchema } = require("./validSchema.js");
// const Review = require("./models/reviewSchema.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userrouter = require("./routes/users.js");

app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error", ()=>{
  console.log('error in mongo session store', err);
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 9 * 24 * 60 * 60 * 1000,
    maxAge: 9 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
main()
  .then((res) => {
    console.log("connection is working");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}
// function asyncWrap(fn){
//   return function(req, res, next){
//     fn(req, res, next).catch((err)=>next(err));
//   }
// }
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listing", listings);
app.use("/listing/:id/review", reviews);
app.use("/", userrouter);
// app.post("/listing", wrapAsync(async (req, res, next) => {
//     console.log("REQ.BODY >>", req.body);

//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//       let errMsg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, errMsg);
//     }

//     const newlist = new Listing(req.body.listing);
//     await newlist.save();
//     res.redirect("/listing");
// }));

app.get("/", (req, res) => {
  res.send("hi, i am root");
});

app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 404, message } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("listen on port 8080");
});

// app.get("/testing", async(req, res) => {
// //   let listing = new Listing({
// //     title: "my house",
// //     discription: "be the beach",
// //     price: 10000,
// //     location: "goa",
// //     country: "india",
// //   });
// //   await listing.save();
// //   console.log("listing is save");
// //   res.send("successful save");
// });
