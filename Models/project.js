const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	complete: {
		type: Boolean,
		default: false,
	},
	item: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
