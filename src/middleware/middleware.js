const validation = require("../validators/validator");

const createBlogValidation = async function (req, res, next) {
	let { title, body, authorId, category } = req.body;

	if (!title)
		return res
			.status(400)
			.send({ status: false, msg: "title must be present" });

	if (!body)
		return res.status(400).send({ status: false, msg: "body must be present" });

	if (!authorId)
		return res
			.status(400)
			.send({ status: false, msg: "authorId must be present" });

	if (!category)
		return res
			.status(400)
			.send({ status: false, msg: "category must be present" });

	next();
};

const BlogValidation = async function (req, res, next) {
	const requestBody = req.body;

	//1.validation for title
	if (requestBody.title) {
		if (!validation.isValidString(requestBody.title))
			return res
				.status(400)
				.send({ status: false, msg: "title must contain letters" });
	}

	//2.validation for body
	if (requestBody.body) {
		if (!validation.isValidString(requestBody.body))
			return res
				.status(400)
				.send({ status: false, msg: "body must contain letters" });
	}

	//3.validation for category
	if (requestBody.category) {
		if (!validation.isValidString(requestBody.category))
			return res
				.status(400)
				.send({ status: false, msg: "category must contain letters" });
	}

	//4.validation for tags
	if (requestBody.tags) {
		if (validation.isValidString(requestBody.tags)) {
			arrOfTags = validation.makeArray(requestBody.tags);
			let uniqueArrOfTags = [...new Set(arrOfTags)];
			if (uniqueArrOfTags.length == 0)
				return res.status(400).send({ status: false, msg: "Invalid tags" });
			requestBody.tags = [...uniqueArrOfTags];
		} else if (validation.isValidArray(requestBody.tags)) {
			arrOfTags = validation.flattenArray(requestBody.tags);
			if (arrOfTags.length === 0)
				return res.status(400).send({ status: false, msg: "Invalid tags" });
			let uniqueArrOfTags = [...new Set(arrOfTags)];
			requestBody.tags = [...uniqueArrOfTags];
		} else {
			return res.status(400).send({ status: false, msg: "Invalid tags" });
		}
	}

	//5.validation for subcategory
	if (requestBody.subcategory) {
		if (validation.isValidString(requestBody.subcategory)) {
			let arrOfSubcategory = validation.makeArray(requestBody.subcategory);
			let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];
			if (uniqueArrOfSubcategory.length == 0)
				return res
					.status(400)
					.send({ status: false, msg: "Invalid subcategory" });
			requestBody.subcategory = [...uniqueArrOfSubcategory];
		} else if (validation.isValidArray(requestBody.subcategory)) {
			let arrOfSubcategory = validation.flattenArray(requestBody.subcategory);
			if (arrOfSubcategory.length === 0)
				return res
					.status(400)
					.send({ status: false, msg: "Invalid subcategory" });
			let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];
			requestBody.subcategory = [...uniqueArrOfSubcategory];
		} else {
			return res
				.status(400)
				.send({ status: false, msg: "Invalid subcategory" });
		}
	}
	if (requestBody.isPublished === true) requestBody.publishedAt = new Date();
	req.modifiedBody = requestBody;
	next();
};

const BlogValidationFromQuery = async function (req, res, next) {
	try {
		const { authorId, category, tags, subcategory } = req.query;
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
			dynamicObj.category = category.toLowerCase();
		}

		if (tags) {
			if (validation.isValidString(tags)) {
				arrOfTags = validation.makeArray(tags.toLowerCase());
				if (arrOfTags.length == 0) {
					return res.status(400).send({ status: false, msg: "Invalid tags" });
				}
			}
			dynamicObj.tags = { $in: arrOfTags };
		}

		if (subcategory) {
			if (validation.isValidString(subcategory)) {
				arrOfsubcategory = validation.makeArray(subcategory.toUpperCase());
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

module.exports = {
	BlogValidationFromQuery,
	createBlogValidation,
	BlogValidation,
};
