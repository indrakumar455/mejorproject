const Listing = require("./models/listing");
const { reviewSchema, listingSchema } = require("./validSchema");
const ExpressError = require("./uitls/ExpressError");
const Review= require("./models/reviewSchema");
const owner = async (req, res, next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.user.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this listing");
      return res.redirect(`/listing/${id}`);
    }
    next();
}
const isAuthor = async (req, res, next)=>{
    let {id,  reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the author of this review");
      return res.redirect(`/listing/${id}`);
    }
    next();
}

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to access this page!");
    return res.redirect("/login");
  }
  next();
};

const saveredirectUrl = (req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  };
  next();
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports ={owner, isLoggedIn, validateListing,validateReview, saveredirectUrl, isAuthor};