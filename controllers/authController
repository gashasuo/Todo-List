const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

module.exports.getRegisterForm = (req, res) => {
	res.render("auth/register.ejs", { title: "Register" });
};

module.exports.postRegisterForm = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		if (!email || !username || !password) {
			throw new AppError("Please fill out all parts of the form", 400);
		}
		const registeredUser = await User.register(user, password);
		const newProject = new Project({ name: "Inbox", user: registeredUser._id });
		await newProject.save();
		req.flash("success", "Successfully registered!");
		res.redirect("/projects");
	} catch (e) {
		next(e);
	}
};

module.exports.getLoginForm = (req, res) => {
	res.render("auth/login.ejs", { title: "Login" });
};

module.exports.postLoginForm = async (req, res) => {
	req.session.activeUser = req.user._id;
	req.flash("success", "Successfully logged in!");
	res.redirect("/projects");
};

module.exports.logout = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	req.session.activeUser = null;
	req.flash("success", "Successfully logged out");
	res.redirect("/projects");
};
