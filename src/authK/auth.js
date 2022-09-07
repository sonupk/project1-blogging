const jwt = require("jsonwebtoken");
const BlogModel = require("../modelPR/BlogsModel");
// const token = jwt.sign({ authorId: author._id }, secretkey);

const userAuthentication = async function (req, res, next) {
	try {
		const secretkey = "plutoniumFunctionup$%(())()*)+/";
		let token = req.headers["x-api-token"];
		if (!token)
			return res
				.status(401)
				.send({ status: false, msg: "Please provide a token" });
		let decodedToken = jwt.verify(token, secretkey);
		if (!decodedToken)
			res.status(401).send({ status: false, msg: "Invalid token" });
		req["x-api-key"] = decodedToken;
		next();
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

// / ==> Authorization middleware function for PUT api and DELETE api by blogId in the path params
const userAuthorisation = async function (req, res, next) {
	let userId = req["x-api-key"].authorId;
	let blogId = req.params.blogId;
	let blog = await blogModel.findById(blogId);
	if (blog.authorId.toString() !== userId)
		return res
			.status(403)
			.send({
				status: false,
				msg: "You are not authorized to access this blog",
			});
	next();
};

module.exports = { userAuthentication, userAuthorisation };
