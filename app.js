const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Item = require("./Models/item");

mongoose.connect("mongodb://localhost:27017/todo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.get("/dog", (req, res) => {
	res.send("Woof!");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});

const i = new Item({
	todo: "Test Data",
});
i.save()
	.then((i) => {
		console.log(i);
	})
	.catch((e) => {
		console.log(e);
	});
