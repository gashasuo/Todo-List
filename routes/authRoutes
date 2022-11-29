const express = require("express");

const router = express.Router({ mergeParams: true });
const { isLoggedIn, isProjectOwner, isItemOwner } = require("../middleware");

const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

const passport = require("passport");
const localStrategy = require("passport-local");

const { postLoginForm } = require("../controllers/authController");
const { getLoginForm } = require("../controllers/authController");
const { postRegisterForm } = require("../controllers/authController");
const { getRegisterForm } = require("../controllers/authController");
const { logout } = require("../controllers/authController");

//register - get
router.get("/register", getRegisterForm);

//register - post
router.post("/register", postRegisterForm);

//login - get
router.get("/login", getLoginForm);

//login - post
router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	postLoginForm
);

//logout
router.get("/logout", logout);

module.exports = router;
