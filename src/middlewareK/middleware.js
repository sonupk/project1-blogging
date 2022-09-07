const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBlogValidation = async function (req, res, next) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const tags = req.query.specificTag;
		const subcategory = req.query.subcategory;
		if (authorId) {
			if (!ObjectId.isValid(authorId))
				return res
					.status(400)
					.send({ status: false, msg: "Invalid Object Id" });
		}
		if (category) {
			if (typeof category != "string" || category.length == 0) {
				return res
					.status(400)
					.send({ status: false, msg: "category is invalid" });
			}
		}
		if (tags) {
			if (typeof tags != "string" || tags.trim().length == 0) {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid content in tags" });
			}
		}
		if (subcategory) {
			if (typeof subcategory != "string" || subcategory.trim().length == 0)
				return res
					.status(400)
					.send({ status: false, msg: "Invalid content in subcategory" });
		}
		next();
	} catch (error) {
		res.status(500).send({ msg: error });
	}
};

module.exports = { getBlogValidation };
