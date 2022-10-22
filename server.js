const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Item = require("./models/item");
const Project = require("./models/project");
const { update, updateOne, countDocuments } = require("./models/item");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/todo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

//show all projects
app.get("/projects", async (req, res) => {
	await Project.findOneAndUpdate(
		{ name: "Today" },
		{ name: "Today" },
		{
			new: true,
			upsert: true,
		}
	);
	const projects = await Project.find({});
	res.render("projects/projects.ejs", { projects, title: "All Projects" });
});

//create project - get
app.get("/projects/new", (req, res) => {
	res.render("projects/new.ejs", { title: "Create Project" });
});

//create project - post
app.post("/projects", async (req, res) => {
	const newProject = new Project(req.body);
	await newProject.save();
	res.redirect("/projects");
});

//edit project - get
app.get("/projects/:id/edit", async (req, res) => {
	const project = await Project.findById(req.params.id);
	res.render("projects/edit.ejs", { project, title: "Edit Project" });
});

//edit project - put
app.put("/projects/:id", async (req, res) => {
	const project = await Project.findByIdAndUpdate(req.params.id, req.body);
	res.redirect(`/projects/${project._id}`);
});

//show project details
app.get("/projects/:id", async (req, res) => {
	const project = await Project.findById(req.params.id);
	const items = await Item.find({ project: req.params.id });
	res.render("projects/show.ejs", { items, project, title: project.name });
});

//delete project
app.delete("/projects/:id", async (req, res) => {
	await Project.findByIdAndDelete(req.params.id);
	res.redirect("/projects");
});

//ITEMS
//show all items
app.get("/items", async (req, res) => {
	const items = await Item.find({});
	const complete = await Item.countDocuments({ complete: false });
	res.render("items/index.ejs", { items, complete, title: "All Items" });
});

//create item - get
app.get("/items/new", async (req, res) => {
	const projects = await Project.find({});
	res.render("items/new.ejs", { projects, title: "Create Item" });
});

//create item - post
app.post("/items", async (req, res) => {
	const newItem = new Item(req.body);
	await newItem.save();
	res.redirect("/items");
});

//edit item - get
app.get("/items/:id/edit", async (req, res) => {
	const item = await Item.findById(req.params.id);
	const projects = await Project.find({});
	res.render("items/edit.ejs", { projects, item, title: "Edit Item" });
});

//edit item - put
app.put("/items/:id", async (req, res) => {
	const item = await Item.findByIdAndUpdate(req.params.id, req.body);
	res.redirect(`/items/${item._id}`);
});

//update item as completed - put
app.put("/items/:id/markComplete", async (req, res) => {
	await Item.findByIdAndUpdate(
		{ _id: req.body.elementID },
		{
			complete: true,
		}
	);
	const complete = await Item.countDocuments({ complete: false });
	return res.json(complete);
});

//update item as completed - put
app.put("/items/:id/markIncomplete", async (req, res) => {
	await Item.findByIdAndUpdate(
		{ _id: req.body.elementID },
		{
			complete: false,
		}
	);
	const complete = await Item.countDocuments({ complete: false });
	return res.json(complete);
});

//show item detail
app.get("/items/:id", async (req, res) => {
	const item = await Item.findById(req.params.id);
	const project = await Project.findById(item.project);
	res.render("items/show.ejs", { project, item, title: item.name });
});

//delete item
app.delete("/items/:id", async (req, res) => {
	await Item.findByIdAndDelete(req.params.id);
	res.redirect("/items");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});
