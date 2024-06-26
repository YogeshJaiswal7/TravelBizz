const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js")

router.get("/signup", userController.renderSignup);

router.post("/signup", userController.signUp );

router.get("/login",userController.renderLogin);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
  }), userController.login);

router.get("/logout", userController.logout )


module.exports = router