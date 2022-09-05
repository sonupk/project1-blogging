const BlogModel = require("../model/blogmodel.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBlogs = async function (req, res) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const specificTag = req.query.specificTag;
		const subcategory = req.query.subcategory;
		let obj = { isDeleted: false, isPublished: true };
		if (ObjectId.isValid(authorId)) obj["authorId._id"] = authorId;
		if (typeof category === "string") obj.category = category;
		if (typeof specificTag === "string") obj.tags = specificTag;
		if (typeof subcategory === "string") obj.subcategory = subcategory;
		const allBlogs = await BlogModel.find().populate("authorId").find(obj);
		if (allBlogs.length === 0)
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		res.status(200).send(allBlogs);
	} catch (error) {
		res.status(500).send({ msg: error });
	}
};

module.exports = { getBlogs };
