const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isAuthor} = require("../middleware.js");
const Review = require("../models/reviewSchema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../uitls/ExpressError.js");
const wrapAsync = require("../uitls/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const controller = require("../controllers/reviews.js");

// reivew routing ================================
// ===============================================
// router.post("/", async(req, res)=>{
//   let listing = await Listing.findById(req.params.id);
//   let newReview =  new Review(req.body.review);   //(req.body.rating)
//   listing.review.push(newReview);
//   await newReview.save();
//   await listing.save();
//   res.send("new review saved")
// })

// Route: read nested review object, coerce rating to Number, push as subdoc [web:49][web:110]
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(controller.createdreview)
);

// review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(controller.delete)
);

module.exports = router;
