const Review = require("../models/reviewSchema");
const Listing = require("../models/listing");

module.exports.createdreview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview); // push subdocument into parent array [web:110]
  await newReview.save();
  await listing.save();
  req.flash("success", "successful created a new reviews");
  res.redirect(`/listing/${listing._id}`);
};
module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "successful deleted your review");
  res.redirect(`/listing/${id}`);
};
