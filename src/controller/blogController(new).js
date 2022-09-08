const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const authorModel = require("../models/authorModel");
const validation = require("../validators/validator");

// FIRST HANDLER
const createBlog = async function (req, res) {
	try {
		const requestBody = req.body;
		// Destructuring
		let { title, body, authorId, tags, category, subcategory, isPublished } =
			requestBody;

		//Validation Starts
		//1.validation for title
		if (!validation.isValidTitle(title)) {
			res.status(400).send({ status: false, msg: "title is required" });
			return;
		}

		//2.validation for body
		if (!validation.isValidString(body)) {
			res.status(400).send({ status: false, msg: "body is required" });
			return;
		}

		//3.validation for authorID
		const author = await authorModel.findById(authorId);
		if (!validation.isValidObjectId(authorId) || !author) {
			res.status(400).send({ status: false, msg: "authorId is invalid" });
			return;
		}

		//4.validation for tags
		if (tags) {
			if (!validation.isValidString(tags)) {
				res.status(400).send({ status: false, msg: "invalid tags" });
				return;
			}
			let arrOfTags = tags
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.trim().length > 0);
			arrOfTags = [...new Set(arrOfTags)];
			if (arrOfTags.length == 0) {
				res.status(400).send({ status: false, msg: "Invalid tags" });
				return;
			}

			requestBody.tags = [...arrOfTags];
		}

		//5.validation for category
		if (!validation.isValidString(category)) {
			res.status(400).send({ status: false, msg: "category is invalid" });
			return;
		}

		//6.validation for subcategory
		if (subcategory) {
			if (!validation.isValidString(subcategory)) {
				res.status(400).send({ status: false, msg: "invalid subcategory" });
				return;
			}
			let arrOfsubcategory = subcategory
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.trim().length > 0);
			arrOfsubcategory = [...new Set(arrOfsubcategory)];
			if (arrOfsubcategory.length == 0) {
				res.status(400).send({ status: false, msg: "Invalid subcategory" });
				return;
			}
			requestBody.subcategory = [...arrOfsubcategory];
		}
		// Validation Ends

		if (isPublished == true) {
			requestBody.publishedAt = new Date();
		}

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
		const allBlogs = await blogModel.find(filterObj);
		if (allBlogs.length === 0)
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		return res.status(200).send({ status: true, data: allBlogs });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error.message });
	}
};

const updateBlog = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const updateData = req.body;

		//destructuring
		const { title, body, tags, subcategory } = updateData;

		//Validaition starts
		//Validation for blogId
		if (!validation.isValidObjectId(blogId)) {
			res.status(400).send({ status: false, msg: "Invalid BlogId" });
			return;
		}
		//finding blog
		const blog = await blogModel.find({ _id: blogId });
		if (blog.length == 0 || blog["isDeleted"] == true) {
			res.status(404).send({ status: false, msg: "No blog found" });
			return;
		}

		//adding data in obj which are needed to be update
		let obj = {};
		obj.isPublished = true;
		obj.publishedAt = new Date();

		if (title) {
			//validation for title
			if (!validation.isValidString(title)) {
				res
					.status(400)
					.send({ status: false, msg: "Invalid content in title" });
				return;
			}
			obj.title = title;
		}

		if (body) {
			//validation for body
			if (!validation.isValidString(body)) {
				res.status(400).send({ status: false, msg: "Invalid content in body" });
				return;
			}
			obj.body = body;
		}

		obj["$addToSet"] = {};

		if (tags) {
			//validation for tags
			if (!validation.isValidString(tags)) {
				res.status(400).send({ status: false, msg: "Invalid content in tags" });
				return;
			}
			let arr = tags
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.trim().length > 0);
			//obj={$addToSet:{}}
			arr = [...new Set(arr)];
			obj["$addToSet"]["tags"] = [...arr];
			//  $each to add each element of array
			//  $addToSet to stop pushing duplicate elements
		}

		if (subcategory) {
			//validation for subcategory
			if (!validation.isValidString(subcategory)) {
				res
					.status(400)
					.send({ status: false, msg: "Invalid content in subcategory" });
				return;
			}
			let arr = subcategory
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.trim().length > 0);
			arr = [...new Set(arr)];
			obj["$addToSet"]["subcategory"] = { $each: [...arr] };
		}

		//Updation
		const updatedBlog = await blogModel.findByIdAndUpdate(blogId, obj, {
			new: true,
		});
		res.status(200).send({ status: true, data: updatedBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		if (!ObjectId.isValid(blogId)) {
			return res
				.status(400)
				.send({ status: false, msg: "BlogId in not valid" });
		}
		const deletedBlog = await blogModel.findOneAndUpdate(
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

const deleteFromQuery = async function (req, res) {
	try {
		let data = req.modifiedQuery;
		data.isDeleted = false;
		if (data.authorId) {
			if (data.authorId !== req["x-api-key"].authorId)
				return res.send({ status: false, msg: "User not authorised" });
		}
		if (!data.authorId) data.authorId = req["x-api-key"].authorId;
		if (!ObjectId.isValid(data.authorId)) {
			return res
				.status(400)
				.send({ status: false, msg: "BlogId in not valid" });
		}
		let find = await blogModel.findOne(data);
		if (!find) {
			return res.status(404).send({ msg: "Blog not found" });
		}
		let update = await blogModel.findOneAndUpdate(
			data,
			{ $set: { isDeleted: true, deletedAt: Date.now() } },
			{ new: true }
		);
		res.status(200).send({ msg: update });
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
