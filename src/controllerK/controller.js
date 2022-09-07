const BlogModel = require("../modelPR/BlogsModel");

const getBlogs = async function (req, res) {
	try {
		//TODO:const filterObj=req.query (Doing this will remove lines 6-14)
		//TODO:filterObj.isDeleted=false
		//TODO:filterObj.isPublished=true

		const authorId = req.query.authorId;
		const category = req.query.category;
		const specificTag = req.query.specificTag;
		const subcategory = req.query.subcategory;
		let obj = { isDeleted: false, isPublished: true };
		if (authorId) obj["authorId"] = authorId;
		if (category) obj.category = category;
		if (specificTag) obj.tags = specificTag;
		if (subcategory) obj.subcategory = subcategory;
		const allBlogs = await BlogModel.find(obj);
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
			{
				isDeleted: true,
				deletedAt: new Date(),
			}
		);
		return deletedBlog
			? res.status(200).send()
			: res.status(404).send({ status: false, msg: "Resource Not Found" });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error });
	}
};

module.exports = { getBlogs, deleteBlogById };
