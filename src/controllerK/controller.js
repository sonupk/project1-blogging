const mongoose = require("mongoose");

const BlogModel = require("../modelPR/BlogsModel");

const getBlogs = async function (req, res) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const specificTag = req.query.specificTag;
		const subcategory = req.query.subcategory;
		let obj = { isDeleted: false, isPublished: true };
		if (authorId) obj["authorId"] = authorId;
		if (category) obj.category = category;
		if (specificTag) obj.tags = specificTag;
		if (subcategory) obj.subcategory = subcategory;
		console.log(obj);
		const allBlogs = await BlogModel.find(obj);
		console.log(allBlogs);
		if (allBlogs.length === 0)
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		res.status(200).send({ status: true, data: allBlogs });
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const deletedBlog = await BlogModel.findOneAndUpdate(
			{ _id: blogId, isDeleted: false },
			{
				isDeleted: true,
			}
		);
		return deletedBlog
			? res.status(200).send()
			: res.status(404).send({ status: false, msg: "Resource Not Found" });
	} catch (error) {
		res.status(500).send({ status: false, msg: error });
	}
};

module.exports = { getBlogs, deleteBlogById };
