const blogModel = require("../modelPR/BlogsModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const authorModel = require("../modelPR/AuthorModel");

// FIRST HANDLER
const createBlog = async function (req, res) {
	try {
		const requestBody = req.body;
		// Destructuring
		let { title, body, authorId, tags, category, subcategory, isPublished } =
			requestBody;

		//Validation Starts
		//1.validation for title
		if (!title || typeof title != "string" || title.trim().length == 0) {
			res.status(400).send({ status: false, msg: "title is required" });
			return;
		}

		//2.validation for body
		if (!body || typeof body != "string" || body.trim().length == 0) {
			res.status(400).send({ status: false, msg: "body is required" });
			return;
		}

		//3.validation for authorID
		const author = await authorModel.findById(authorId);
		if (!ObjectId.isValid(authorId) || !author) {
			res.status(400).send({ status: false, msg: "authorId is invalid" });
			return;
		}

		//4.validation for tags
		if (tags) {
			if (typeof tags != "string" || tags.trim().length == 0) {
				res.status(400).send({ status: false, msg: "invalid tags" });
				return;
			}
			let arrOfTags = tags
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.length > 0);
			console.log(arrOfTags);
			if (arrOfTags.length == 0) {
				res.status(400).send({ status: false, msg: "Invalid tags" });
				return;
			} else {
				requestBody.tags = [...arrOfTags];
			}
		}

		//5.validation for category
		if (!category || typeof category != "string" || category.length == 0) {
			res.status(400).send({ status: false, msg: "category is invalid" });
			return;
		}

		//6.validation for subcategory
		if (subcategory) {
			if (typeof subcategory != "string" || subcategory.trim().length == 0) {
				res.status(400).send({ status: false, msg: "invalid subcategory" });
				return;
			}
			let arrOfsubcategory = subcategory
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.length > 0);
			console.log(arrOfsubcategory);
			if (arrOfsubcategory.length == 0) {
				res.status(400).send({ status: false, msg: "Invalid subcategory" });
				return;
			} else {
				requestBody.subcategory = [...arrOfsubcategory];
			}
		}

		// Validation Ends
		//*? shouldn't it be isPublished==="true", because if its false in the body it will still update the publishedAt field
		if (isPublished) {
			requestBody.publishedAt = new Date();
		}
		const newBlog = await blogModel.create(requestBody);

		res.status(201).send({ status: true, data: newBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

// 4th HANDLER
const updateBlog = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const updateData = req.body;

		//destructuring
		const { title, body, tags, subcategory } = updateData;

		//finding blog
		const blog = await blogModel.find({ _id: blogId });
		if (blog.length == 0 || blog["isDeleted"] == "false") {
			res.status(404).send({ status: false, msg: "Blog ID is not valid" });
			return;
		}

		//adding data in obj which are needed to be update
		let obj = {};
		obj.isPublished = true;
		obj.publishedAt = new Date();

		if (title) {
			//validation for title
			if (typeof title != "string" || title.trim().length == 0) {
				res
					.status(400)
					.send({ status: false, msg: "Invalid content in title" });
				return;
			}
			obj.title = title;
		}
		if (body) {
			//validation for body
			if (typeof body != "string" || body.trim().length == 0) {
				res.status(400).send({ status: false, msg: "Invalid content in body" });
				return;
			}
			obj.body = body;
		}
		if (tags) {
			//validation for tags
			if (typeof tags != "string" || tags.trim().length == 0) {
				res.status(400).send({ status: false, msg: "Invalid content in tags" });
				return;
			}
			let arr = blog.tags;
			//*TODO: let uniqueArr=[new Set(arr)]
			//**(This will remove the duplicates from the input array) */
			arr.push(tags);
			obj.tags = arr;
		}
		if (subcategory) {
			//validation for subcategory
			if (typeof subcategory != "string" || subcategory.trim().length == 0) {
				res
					.status(400)
					.send({ status: false, msg: "Invalid content in subcategory" });
				return;
			}
			let arr = blog.subcategory;
			//*TODO: let uniqueArr=[new Set(arr)]
			//**(This will remove the duplicates from the input array) */
			arr.push(subcategory);
			obj.subcategory = arr;
		}

		//Updation
		const updatedBlog = await blogModel.findByIdAndUpdate(
			{ blogId },
			{ obj },
			{ new: true }
		);
		res.status(200).send({ status: true, data: updatedBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

module.exports = { createBlog };
