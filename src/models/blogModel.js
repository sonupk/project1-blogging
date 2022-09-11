const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const BlogsModels = new mongoose.Schema(
	{
		title: { type: String, required: true,trim:true,lowercase:true },
		body: { type: String, required: true,trim:true,lowercase:true },
		authorId: { type: ObjectId, ref: "authorModel", required: true },
		tags: { type: [String] },
		category: { type: String, required: true,trim:true,lowercase:true },
		subcategory: { type: [String] },
		deletedAt: { type: Date, default: null },
		isDeleted: { type: Boolean, default: false },
		publishedAt: { type: Date, default: null },
		isPublished: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("blogsmodel", BlogsModels);
