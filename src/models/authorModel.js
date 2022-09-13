const mongoose = require("mongoose");

const AuthorModel = new mongoose.Schema(
	{
		fname: { type: String, required: true, trim:true, lowercase:true },
		lname: { type: String, required: true, trim:true, lowercase:true },
		title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"], trim:true },
		email: { type: String, unique: true, required: true, trim:true, lowercase:true },
		password: { type: String, required: true, trim:true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("authorModel", AuthorModel);
