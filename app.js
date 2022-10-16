const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Item = require("./models/item");
const { userInfo } = require("os");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/todo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

//show all items
app.get("/items", async (req, res) => {
	const items = await Item.find({});
	res.render("index.ejs", { items });
	console.log(items);
});

//create item
app.get("/items/new", (req, res) => {
	res.render("new.ejs");
});

//create item
app.post("/items", async (req, res) => {
	const newItem = new Item(req.body);
	await newItem.save();
	res.redirect("/items");
});

//update item
app.get("/items/:id/edit", async (req, res) => {
	const item = await Item.findById(req.params.id);
	res.render("edit.ejs", { item });
});

//update item
app.put("/items/:id", async (req, res) => {
	const item = await Item.findByIdAndUpdate(req.params.id, req.body);
	res.redirect(`/items/${item._id}`);
});

//show item detail
app.get("/items/:id", async (req, res) => {
	const item = await Item.findById(req.params.id);
	res.render("show.ejs", { item });
});

//delete item
app.delete("/items/:id", async (req, res) => {
	await Item.findByIdAndDelete(req.params.id);
	res.redirect("/items");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});
