const validation = require("../validators/validator");

const BlogValidationFromQuery = async function (req, res, next) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const tags = req.query.tags;
		const subcategory = req.query.subcategory;
		const dynamicObj = {};

		if (authorId) {
			if (!validation.isValidObjectId(authorId)) {
				return res
					.status(400)
					.send({ status: false, msg: "authorId is invalid" });
			}
			dynamicObj.authorId = authorId;
		}

		if (category) {
			if (!validation.isValidString(category)) {
				return res
					.status(400)
					.send({ status: false, msg: "category is invalid" });
			}
			dynamicObj.category = category;
		}

		if (tags) {
			if (validation.isValidString(tags)) {
				let arrOfTags = validation.makeArray(tags);
				if (arrOfTags.length == 0) {
					return res.status(400).send({ status: false, msg: "Invalid tags" });
				}
			}
			dynamicObj.tags = { $in: arrOfTags };
		}

		if (subcategory) {
			if (validation.isValidString(subcategory)) {
				let arrOfsubcategory = validation.makeArray(subcategory);
				if (arrOfsubcategory.length == 0) {
					return res
						.status(400)
						.send({ status: false, msg: "Invalid subcategory" });
				}
			}
			dynamicObj.subcategory = { $in: arrOfsubcategory };
		}

		req.modifiedQuery = dynamicObj;
		next();
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};

module.exports = { BlogValidationFromQuery };
