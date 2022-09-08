const blogModel = require("../models/blogModel");
const validation = require("../validators/validator");

// FIRST HANDLER
const createBlog = async function (req, res) {
	try {
		const requestBody = req.body;
		// Destructuring
		let { title, body, authorId, category, tags, subcategory, isPublished } =
			requestBody;

		if (!title) {
			res.status(400).send({ status: false, msg: "title must be present" });
		}
		if (!body) {
			res.status(400).send({ status: false, msg: "body must be present" });
		}
		if (!authorId) {
			res.status(400).send({ status: false, msg: "authorId must be present" });
		}
		if (!category) {
			res.status(400).send({ status: false, msg: "category must be present" });
		}

		//Validation Starts
		//1.validation for title
		if (!validation.isValidString(title)) {
			res
				.status(400)
				.send({ status: false, msg: "title must contain letters" });
			return;
		}

		//2.validation for body
		if (!validation.isValidString(body)) {
			res.status(400).send({ status: false, msg: "body must contain letters" });
			return;
		}

		//3.validation for tags
		if (tags) {
			if (validation.isValidString(tags)) {
				let arrOfTags = validation.makeArray(tags);
				let uniqueArrOfTags = [...new Set(arrOfTags)];
				if (uniqueArrOfTags.length == 0) {
					res.status(400).send({ status: false, msg: "Invalid tags" });
					return;
				}
				requestBody.tags = [...uniqueArrOfTags];
			} else if (validation.isValidArray(tags)) {
				let arrOfTags = validation.flattenArray(tags);
				if (arrOfTags.length === 0)
					return res.status(400).send({ status: false, msg: "Invalid tags" });
				requestBody.tags = [...arrOfTags];
			} else {
				res.status(400).send({ status: false, msg: "Invalid tags" });
				return;
			}
		}

		//4.validation for category
		if (!validation.isValidString(category)) {
			res
				.status(400)
				.send({ status: false, msg: "category must contain letters" });
			return;
		}

		//5.validation for subcategory
		if (subcategory) {
			if (validation.isValidString(subcategory)) {
				let arrOfSubcategory = validation.makeArray(subcategory);
				let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];
				if (uniqueArrOfSubcategory.length == 0) {
					res.status(400).send({ status: false, msg: "Invalid subcategory" });
					return;
				}
				requestBody.subcategory = [...uniqueArrOfSubcategory];
			} else if (validation.isValidArray(subcategory)) {
				let arrOfSubcategory = validation.flattenArray(subcategory);
				if (arrOfSubcategory.length === 0)
					return res
						.status(400)
						.send({ status: false, msg: "Invalid subcategory" });
				requestBody.subcategory = [...arrOfSubcategory];
			} else {
				res.status(400).send({ status: false, msg: "Invalid subcategory" });
				return;
			}
		}
		// Validation Ends

		if (isPublished === true) {
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
		const updateData = req.body;

		//destructuring
		let { title, body, tags, subcategory } = updateData;

		//adding data in obj which are needed to be update
		let obj = {};
		obj.isPublished = true;
		obj.publishedAt = new Date();
		obj["$addToSet"] = {};

		// Validaition starts
		//1. Validation for title
		if (title) {
			if (!validation.isValidString(title)) {
				res
					.status(400)
					.send({ status: false, msg: "Invalid content in title" });
				return;
			}
			obj.title = title;
		}

		//2. Validation for body
		if (body) {
			if (!validation.isValidString(body)) {
				res.status(400).send({ status: false, msg: "Invalid content in body" });
				return;
			}
			obj.body = body;
		}

		//3. Validation for tags
		if (tags) {
			if (validation.isValidString(tags)) {
				let arrOfTags = validation.makeArray(tags);
				uniqueArrOfTags = [...new Set(arrOfTags)];
				obj["$addToSet"]["tags"] = [...uniqueArrOfTags];
				//  $each to add each element of array
				//  $addToSet to stop pushing duplicate elements
			} else if (validation.isValidArray(tags)) {
				let arrOfTags = validation.flattenArray(tags);
				obj["$addToSet"]["tags"] = [...tags];
			} else {
				res.status(400).send({ status: false, msg: "Invalid content in tags" });
				return;
			}
		}

		//4. Validation for subcategory
		if (subcategory) {
			if (validation.isValidString(subcategory)) {
				let arrOfSubcategory = validation.makeArray(subcategory);
				let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];
				obj["$addToSet"]["subcategory"] = {
					$each: [...uniqueArrOfSubcategory],
				};
			} else if (validation.isValidArray(subcategory)) {
				let arrOfSubcategory = validation.flattenArray(subcategory);
				obj["$addToSet"]["subcategory"] = { $each: [...arrOfSubcategory] };
			} else {
				res.status(400).send({ status: false, msg: "Invalid content in tags" });
				return;
			}
		}

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

		let findModel = await blogModel.find(data);
		if (findModel.length == 0) {
			return res.status(404).send({ status: false, msg: "Blog not found" });
		}
		let update = await blogModel.updateMany(
			data,
			{ $set: { isDeleted: true, deletedAt: Date.now() } },
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
