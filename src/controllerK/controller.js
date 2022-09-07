const BlogModel = require("../modelPR/BlogsModel");

const getBlogs = async function (req, res) {
	try {
		const filterObj = req.modifiedQuery;
		filterObj.isDeleted = false;
		filterObj.isPublished = true;
		const allBlogs = await BlogModel.find(filterObj);
		if (allBlogs.length === 0)
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		return res.status(200).send({ status: true, data: allBlogs });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error.message });
	}
};

const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const deletedBlog = await BlogModel.findOneAndUpdate(
			{ _id: blogId, isDeleted: false },
			{ isDeleted: true, deletedAt: new Date() }
		);
		return deletedBlog
			? res.status(200).send()
			: res.status(404).send({ status: false, msg: "Resource Not Found" });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error });
	}
};

module.exports = { getBlogs, deleteBlogById };
