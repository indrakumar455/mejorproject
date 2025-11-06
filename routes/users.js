const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../uitls/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");
const controller = require("../controllers/user");

router.get("/signup", controller.signup);

router.post("/signup", wrapAsync(controller.registeredUser));

router.get("/login", controller.login);

router.post(
  "/login",
  saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wunderlust");
    res.redirect(res.locals.redirectUrl || "/listing");
  }
);

router.get("/logout", controller.logout);
module.exports = router;
