const mongoose = require("mongoose");

const AuthorModel = new mongoose.Schema(
	{
		fname: { type: String, required: true },
		lname: { type: String, required: true },
		title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
		email: { type: String, unique: true, required: true },
		password: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("authorModel", AuthorModel);
