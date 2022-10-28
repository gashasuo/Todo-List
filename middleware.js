const Item = require("./models/item");
const Project = require("./models/project");
const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/login");
	}
	next();
};

module.exports.isProjectOwner = async (req, res, next) => {
	const project = await Project.findById(req.params.id);
	const user = await User.findById(project.user);
	if (String(user._id) != String(req.user._id)) {
		req.flash("error", "You don't have permission to do that");
		return res.redirect("/projects");
	}
	next();
};

module.exports.isItemOwner = async (req, res, next) => {
	const item = await Item.findById(req.params.id);
	const user = await User.findById(item.user);
	if (String(user._id) != String(req.user._id)) {
		req.flash("error", "You don't have permission to do that");
		return res.redirect("/items");
	}
	next();
};
