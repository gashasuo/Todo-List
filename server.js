const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const { isLoggedIn, isProjectOwner, isItemOwner } = require("./middleware");
const flash = require("connect-flash");

const Item = require("./models/item");
const Project = require("./models/project");
const User = require("./models/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(
	session({ secret: "secretkey", resave: false, saveUninitialized: false })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/todo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
});

//register - get
app.get("/register", (req, res) => {
	res.render("auth/register.ejs", { title: "Register" });
});

//register - post
app.post("/register", async (req, res) => {
	const { email, username, password } = req.body;
	const user = new User({ email, username });
	const registeredUser = await User.register(user, password);
	const newProject = new Project({ name: "Inbox", user: registeredUser._id });
	await newProject.save();
	req.flash("success", "Successfully registered!");
	res.redirect("/projects");
});

//login - get
app.get("/login", (req, res) => {
	res.render("auth/login.ejs", { title: "Login" });
});

//login - post
app.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	async (req, res) => {
		req.session.activeUser = req.user._id;
		req.flash("success", "Successfully logged in!");
		res.redirect("/projects");
	}
);

//logout
app.get("/logout", (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	req.session.activeUser = null;
	req.flash("success", "Successfully logged out");
	res.redirect("/projects");
});

//show all projects
app.get("/projects", isLoggedIn, async (req, res) => {
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
});

//create project - get
app.get("/projects/new", isLoggedIn, (req, res) => {
	res.render("projects/new.ejs", { title: "Create Project" });
});

//create project - post
app.post("/projects", isLoggedIn, async (req, res) => {
	const newProject = new Project(req.body);
	newProject.user = req.user._id;
	await newProject.save();
	res.redirect("/projects");
});

//edit project - get
app.get("/projects/:id/edit", isLoggedIn, isProjectOwner, async (req, res) => {
	const project = await Project.findById(req.params.id);
	res.render("projects/edit.ejs", { project, title: "Edit Project" });
});

//edit project - put
app.put("/projects/:id", isLoggedIn, isProjectOwner, async (req, res) => {
	const project = await Project.findByIdAndUpdate(req.params.id, req.body);
	res.redirect(`/projects/${project._id}`);
});

//show project details
app.get("/projects/:id", isLoggedIn, isProjectOwner, async (req, res) => {
	const project = await Project.findOne({ _id: req.params.id });
	const user = await User.findById(project.user);
	const items = await Item.find({ project: req.params.id, user: project.user });
	res.render("projects/show.ejs", {
		items,
		project,
		user,
		title: project.name,
	});
});

//delete project
app.delete("/projects/:id", isLoggedIn, isProjectOwner, async (req, res) => {
	await Project.findByIdAndDelete(req.params.id);
	res.redirect("/projects");
});

//ITEMS
//show all items
app.get("/items", isLoggedIn, async (req, res) => {
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
});

//create item - get
app.get("/items/new", isLoggedIn, async (req, res) => {
	const projects = await Project.find({});
	res.render("items/new.ejs", { projects, title: "Create Item" });
});

//create item - post
app.post("/items", isLoggedIn, async (req, res) => {
	const newItem = new Item(req.body);
	newItem.user = req.user._id;
	await newItem.save();
	const project = await Project.findByIdAndUpdate(req.body.project, {
		item: newItem._id,
	});
	res.redirect("/items");
});

//edit item - get
app.get("/items/:id/edit", isLoggedIn, isItemOwner, async (req, res) => {
	const item = await Item.findById(req.params.id).populate("project");
	const projects = await Project.find({});
	res.render("items/edit.ejs", { projects, item, title: "Edit Item" });
});

//edit item - put
app.put("/items/:id", isLoggedIn, isItemOwner, async (req, res) => {
	const item = await Item.findByIdAndUpdate(req.params.id, req.body);
	const project = await Project.findByIdAndUpdate(req.body.project, {
		item: req.params.id,
	});
	res.redirect(`/items/${item._id}`);
});

//update project as completed - put
app.put("/projects/:id/markComplete", isLoggedIn, async (req, res) => {
	await Project.findByIdAndUpdate(
		{ _id: req.body.elementID },
		{
			complete: true,
		}
	);
	// await Item.updateMany({ project: req.body.elementID }, { complete: true });
	const complete = await Project.aggregate([
		{ $match: { user: req.user._id, complete: false } },
		{ $group: { _id: "$name" } },
	]);
	const completeNumber = complete.length - 1;
	return res.json(completeNumber);
});

//update item as completed - put
app.put("/items/:id/markComplete", isLoggedIn, async (req, res) => {
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
});

//update project as not completed - put
app.put("/projects/:id/markIncomplete", isLoggedIn, async (req, res) => {
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
});

//update item as not completed - put
app.put("/items/:id/markIncomplete", isLoggedIn, async (req, res) => {
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
});

//update all items completed - put
app.put("/projects/:id/markAllitemsComplete", isLoggedIn, async (req, res) => {
	await Item.updateMany({ project: req.body.elementID }, { complete: true });
	const items = await Item.find({ project: req.body.elementID });
	return res.json(items);
});

//show item detail
app.get("/items/:id", isLoggedIn, isItemOwner, async (req, res) => {
	const item = await Item.findById(req.params.id);
	const project = await Project.findById(item.project);
	res.render("items/show.ejs", { project, item, title: item.name });
});

//delete item
app.delete("/items/:id", isLoggedIn, isItemOwner, async (req, res) => {
	await Item.findByIdAndDelete(req.params.id);
	res.redirect("/items");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});
