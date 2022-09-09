const blogModel = require("../models/blogModel");

const createBlog = async function (req, res) {
	try {
		const requestBody = req.modifiedBody;
		const newBlog = await blogModel.create(requestBody);
		res.status(201).send({ status: true, data: newBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

const getBlogs = async function (req, res) {
	try {
		const filterObj = req.modifiedQuery;
		filterObj.isDeleted = false;
		filterObj.isPublished = true;
		const allBlogs = await blogModel.find(filterObj).populate("authorId");
		if (allBlogs.length === 0) {
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		}
		res.status(200).send({
			status: true,
			data: allBlogs,
			msg: `${allBlogs.length} blog(s) found`,
		});
	} catch (error) {
		return res.status(500).send({ status: false, msg: error.message });
	}
};

const updateBlog = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const updateData = req.modifiedBody;

		let obj = {};
		obj.isPublished = true;
		obj.publishedAt = new Date();
		obj["$addToSet"] = {};

		if (updateData.title) obj.title = updateData.title;
		if (updateData.body) obj.body = updateData.body;
		if (updateData.tags) obj["$addToSet"]["tags"] = [...updateData.tags];
		if (updateData.subcategory)
			obj["$addToSet"]["subcategory"] = { $each: [...updateData.subcategory] };

		//Updation
		const updatedBlog = await blogModel
			.findByIdAndUpdate(blogId, obj, {
				new: true,
			})
			.populate("authorId");
		res
			.status(200)
			.send({ status: true, msg: "Successfully updated", data: updatedBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		let blog = await blogModel.findById(blogId);

		if (!blog || blog["isDeleted"] == true) {
			res.status(404).send({ status: false, msg: "No blog found" });
			return;
		}

		const deletedBlog = await blogModel.findOneAndUpdate(
			{ _id: blogId, isDeleted: false },
			{ isDeleted: true, deletedAt: new Date() }
		);

		res.status(200).send();
	} catch (error) {
		return res.status(500).send({ status: false, msg: error });
	}
};

const deleteFromQuery = async function (req, res) {
	try {
		let data = req.modifiedQuery;
		data.isDeleted = false;
		data.isPublished = false;

		// authorization check
		if (data.authorId) {
			if (data.authorId !== req["x-api-key"].authorId)
				return res.send({ status: false, msg: "User not authorised" });
		}
		if (!data.authorId) data.authorId = req["x-api-key"].authorId;

		let findBlogs = await blogModel.find(data);
		if (findBlogs.length == 0) {
			return res.status(404).send({ status: false, msg: "Blog not found" });
		}
		let update = await blogModel.updateMany(
			data,
			{ $set: { isDeleted: true, deletedAt: new Date() } },
			{ new: true }
		);
		res.status(200).send({
			status: true,
			msg: `Successfully deleted ${update.modifiedCount} blog(s)`,
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

module.exports = {
	createBlog,
	getBlogs,
	updateBlog,
	deleteBlogById,
	deleteFromQuery,
};
