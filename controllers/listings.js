const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let datas = await Listing.find();
  res.render("listing/index.ejs", { datas });
};

module.exports.rendernewform = async (req, res) => {
  await res.render("listing/new.ejs");
};
module.exports.show = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("user");
  if (!data) {
    req.flash("error", "listing you requested does not exits");
    return res.redirect("/listing");
  }
  res.render("listing/show.ejs", { data });
};

module.exports.creatednewlist = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let newlist = new Listing(req.body.listing);
  newlist.user = req.user._id;
  newlist.image = { url, filename };
  await newlist.save();
  req.flash("success", "successful created a new list");
  res.redirect("/listing");
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if(!data){
    req.flash("error", "listing you request in not exits");
    res.redirect("/listing");
  }
const originalImage = data.image.url.replace("/upload", "/upload/h_300,w_250");
res.render("listing/edit", { data, originalImage });
};
module.exports.updatedlist = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "successful update your list");
  res.redirect(`/listing/${id}`);
};
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "successful delete your list");
  res.redirect("/listing");
};
