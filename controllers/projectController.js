const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

module.exports.index = async (req, res, next) => {
	try {
		const projects = await Project.find({ user: req.user._id });
		const complete = await Project.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length - 1;
		res.render("projects/projects.ejs", {
			projects,
			complete: completeNumber,
			title: "All Projects",
		});
	} catch (e) {
		next(e);
	}
};

module.exports.getNewProjectForm = (req, res) => {
	res.render("projects/new.ejs", { title: "Create Project" });
};

module.exports.postNewProject = async (req, res, next) => {
	try {
		const newProject = new Project(req.body);
		newProject.user = req.user._id;
		await newProject.save();
		res.redirect("/projects");
	} catch (e) {
		next(e);
	}
};

module.exports.getEditProjectForm = async (req, res, next) => {
	try {
		const project = await Project.findById(req.params.id);
		res.render("projects/edit.ejs", { project, title: "Edit Project" });
	} catch (e) {
		next(e);
	}
};

module.exports.postEditProject = async (req, res, next) => {
	try {
		const project = await Project.findByIdAndUpdate(req.params.id, req.body);
		res.redirect(`/projects/${project._id}`);
	} catch (e) {
		next(e);
	}
};

module.exports.getProjectDetails = async (req, res, next) => {
	try {
		const project = await Project.findOne({ _id: req.params.id });
		const user = await User.findById(project.user);
		const items = await Item.find({
			project: req.params.id,
			user: project.user,
		});
		res.render("projects/show.ejs", {
			items,
			project,
			user,
			title: project.name,
		});
	} catch (e) {
		next(e);
	}
};

module.exports.deleteProject = async (req, res, next) => {
	try {
		//this part isn't working for some reason
		const inbox = await Project.find({ name: "Inbox" });
		const items = await Item.updateMany(
			{ project: req.params.id },
			{ $set: { project: inbox._id } }
		);
		await items.save();
		//

		await Project.findByIdAndDelete(req.params.id);
		res.redirect("/projects");
	} catch (e) {
		next(e);
	}
};

module.exports.updateProjectComplete = async (req, res, next) => {
	try {
		await Project.findByIdAndUpdate(
			{ _id: req.body.elementID },
			{
				complete: true,
			}
		);
		const complete = await Project.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length - 1;
		return res.json(completeNumber);
	} catch (e) {
		next(e);
	}
};

module.exports.updateProjectIncomplete = async (req, res, next) => {
	try {
		await Project.findByIdAndUpdate(
			{ _id: req.body.elementID },
			{
				complete: false,
			}
		);
		// await Item.updateMany({ project: req.body.elementID }, { complete: false });
		const complete = await Project.aggregate([
			{ $match: { user: req.user._id, complete: false } },
			{ $group: { _id: "$name" } },
		]);
		const completeNumber = complete.length - 1;
		return res.json(completeNumber);
	} catch (e) {
		next(e);
	}
};

module.exports.updateAllProjectItemsComplete = async (req, res, next) => {
	try {
		await Item.updateMany({ project: req.body.elementID }, { complete: true });
		const items = await Item.find({ project: req.body.elementID });
		return res.json(items);
	} catch (e) {
		next(e);
	}
};
