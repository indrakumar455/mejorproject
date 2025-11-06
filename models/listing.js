const mongoose = require("mongoose");
// const { listingSchema } = require("../validSchema");
const Schema = mongoose.Schema;
const Review= require("./reviewSchema");
const User = require("../models/user");

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
   description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
    
  },
  price: {
    type: Number,
    
  },
  location: {
    type: String,
    required: true,
  },
  country : {
    type: String,
    required: true,
  },

  review:[
    {
      type : Schema.Types.ObjectId,
      ref: "review",
    }
  ],
  user:{
    type: Schema.Types.ObjectId,
    ref:"User",
  }
});


// this is listing delete than review all delete 
// =============================================
listSchema.post("findOneAndDelete", async function(listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
    console.log("Associated reviews deleted!");
  }
});
let Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;
