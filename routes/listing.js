const express = require("express");
const router = express.Router();
const ExpressError = require("../uitls/ExpressError.js");
const wrapAsync = require("../uitls/wrapAsync.js");
const Listing = require("../models/listing.js");
const { owner, isLoggedIn, validateListing } = require("../middleware.js");
const controller = require("../controllers/listings.js");
var methodOverride = require("method-override");
router.use(methodOverride("_method"));

const { storage, fileFilter } = require("../cloudconfig.js");
const multer = require("multer");
const upload = multer({ storage });
router
  .route("/")
  .get(wrapAsync(controller.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(controller.creatednewlist)
  );

router.get("/new", isLoggedIn, wrapAsync(controller.rendernewform));
router
  .route("/:id")
  .get(wrapAsync(controller.show))
  .put(
    isLoggedIn,
    owner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(controller.updatedlist)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  owner,
  wrapAsync(controller.rendereditform)
);

router.delete("/:id", isLoggedIn, owner, wrapAsync(controller.delete));

module.exports = router;
