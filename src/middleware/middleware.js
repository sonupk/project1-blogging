const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const BlogValidationFromQuery = async function (req, res, next) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const tags = req.query.tags;
		const subcategory = req.query.subcategory;

		const dynamicObj = {};
		if (authorId) {
			if (!ObjectId.isValid(authorId)) {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid Object Id" });
			} else {
				dynamicObj.authorId = authorId;
			}
		}
		if (category) {
			if (typeof category != "string" || category.length == 0) {
				return res
					.status(400)
					.send({ status: false, msg: "category is invalid" });
			} else {
				dynamicObj.category = category;
			}
		}
		if (tags) {
			if (typeof tags != "string" || tags.trim().length == 0) {
				return res.status(400).send({ status: false, msg: "Invalid tags" });
			}
			let arrOfTags = tags
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.length > 0);
			if (arrOfTags.length == 0) {
				return res.status(400).send({ status: false, msg: "Invalid tags" });
			} else {
				dynamicObj.tags = { $in: arrOfTags };
			}
		}
		if (subcategory) {
			if (typeof subcategory != "string" || subcategory.trim().length == 0) {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid subcategory" });
			}
			let arrOfsubcategory = subcategory
				.split(",")
				.map((x) => x.trim())
				.filter((x) => x.length > 0);
			if (arrOfsubcategory.length == 0) {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid subcategory" });
			} else {
				dynamicObj.subcategory = { $in: arrOfsubcategory };
			}
		}
		req.modifiedQuery = dynamicObj;
		next();
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};

module.exports = { BlogValidationFromQuery };
