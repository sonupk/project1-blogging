const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBlogValidation = async function (req, res, next) {
	try {
		const authorId = req.query.authorId;
		const category = req.query.category;
		const specificTag = req.query.specificTag;
		const subcategory = req.query.subcategory;
		if (!ObjectId.isValid(authorId))
			return res.status(400).send({ msg: "Invalid Object Id" });
		if (typeof category !== "string")
			return res.status(400).send({ msg: "Invalid category" });
		if (typeof specificTag !== "string")
			return res.status(400).send({ msg: "Invalid tag(s)" });
		if (typeof subcategory !== "string")
			return res.status(400).send({ msg: "Invalid subcategory" });
		next();
	} catch (error) {
		res.status(500).send({ msg: error });
	}
};

module.exports = { getBlogValidation };
