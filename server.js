const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Item = require("./models/item");

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

//show all items
app.get("/items", async (req, res) => {
	const items = await Item.find({});
	res.render("index.ejs", { items, title: "All Items" });
});

//create item - get
app.get("/items/new", (req, res) => {
	res.render("new.ejs", { title: "Create Item" });
});

//create item - post
app.post("/items", async (req, res) => {
	const newItem = new Item(req.body);
	await newItem.save();
	res.redirect("/items");
});

//update item - get
app.get("/items/:id/edit", async (req, res) => {
	const item = await Item.findById(req.params.id);
	res.render("edit.ejs", { item, title: "Edit Item" });
});

//update item - put
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
	res.json("Marked Complete");
});

//update item as completed - put
app.put("/items/:id/markIncomplete", async (req, res) => {
	await Item.findByIdAndUpdate(
		{ _id: req.body.elementID },
		{
			complete: false,
		}
	);
	res.json("Marked Incomplete");
});

//show item detail
app.get("/items/:id", async (req, res) => {
	const item = await Item.findById(req.params.id);
	res.render("show.ejs", { item, title: item.name });
});

//delete item
app.delete("/items/:id", async (req, res) => {
	await Item.findByIdAndDelete(req.params.id);
	res.redirect("/items");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});
