const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	todo: {
		type: String,
		required: true,
	},
	complete: {
		type: Boolean,
		default: false,
	},
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
