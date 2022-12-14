const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

module.exports.index = async (req, res, next) => {
	try {
		const items = await Item.find({ user: req.user._id }).populate("project");
		const complete = await Item.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length;
		res.render("items/index.ejs", {
			items,
			complete: completeNumber,
			title: "All Items",
		});
	} catch (e) {
		next(e);
	}
};

module.exports.getNewItemForm = async (req, res, next) => {
	try {
		let currentProject = "";
		if (req.query.returnTo) {
			req.session.returnTo = req.query.returnTo;
		}
		if (req.query.currentProject) {
			currentProject = req.query.currentProject;
		}
		const projects = await Project.find({});
		res.render("items/new.ejs", { projects, title: "Create Item", currentProject });
	} catch (e) {
		next(e);
	}
};

module.exports.postNewItem = async (req, res, next) => {
	try {
		const newItem = new Item(req.body);
		newItem.user = req.user._id;
		await newItem.save();
		const project = await Project.findByIdAndUpdate(req.body.project, {
			item: newItem._id,
		});
		const redirectUrl = res.locals.returnTo || "/items";
		res.redirect(redirectUrl);
	} catch (e) {
		next(e);
	}
};

module.exports.getEditItemForm = async (req, res, next) => {
	try {
		const item = await Item.findById(req.params.id).populate("project");
		const projects = await Project.find({});
		res.render("items/edit.ejs", { projects, item, title: "Edit Item" });
	} catch (e) {
		next(e);
	}
};

module.exports.postEditItem = async (req, res, next) => {
	try {
		const item = await Item.findByIdAndUpdate(req.params.id, req.body);
		const project = await Project.findByIdAndUpdate(req.body.project, {
			item: req.params.id,
		});
		res.redirect(`/items/${item._id}`);
	} catch (e) {
		next(e);
	}
};

module.exports.getItemDetails = async (req, res, next) => {
	try {
		const item = await Item.findById(req.params.id);
		const project = await Project.findById(item.project);
		res.render("items/show.ejs", { project, item, title: item.name });
	} catch (e) {
		next(e);
	}
};

module.exports.deleteItem = async (req, res, next) => {
	try {
		const redirectUrl = req.query.returnTo;
		await Item.findByIdAndDelete(req.params.id);
		res.redirect(redirectUrl);
	} catch (e) {
		next(e);
	}
};

module.exports.updateItemComplete = async (req, res, next) => {
	try {
		await Item.findByIdAndUpdate(
			{ _id: req.body.elementID },
			{
				complete: true,
			}
		);
		const complete = await Item.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length;
		return res.json(completeNumber);
	} catch (e) {
		next(e);
	}
};

module.exports.updateItemIncomplete = async (req, res, next) => {
	try {
		await Item.findByIdAndUpdate(
			{ _id: req.body.elementID },
			{
				complete: false,
			}
		);
		const complete = await Item.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length;
		return res.json(completeNumber);
	} catch (e) {
		next(e);
	}
};
