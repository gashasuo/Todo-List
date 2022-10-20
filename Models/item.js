const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	complete: {
		type: Boolean,
		default: false,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		default: "Today",
	},
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
