const jwt = require("jsonwebtoken");
const BlogModel = require("../models/blogModel");
// const token = jwt.sign({ authorId: author._id }, secretkey);

const userAuthentication = async function (req, res, next) {
	try {
		const secretkey = "plutoniumFunctionup$%(())()*)+/";
		let token = req.headers["x-api-token"];
		if (!token)
			return res
				.status(401)
				.send({ status: false, msg: "Please provide a token" });
		let decodedToken = await jwt.verify(token, secretkey, (err) => {
			if (err) return res.status(401).send(err.message);
			req["x-api-key"] = decodedToken;
			next();
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

// / ==> Authorization middleware function for PUT api and DELETE api by blogId in the path params
const userAuthorisation = async function (req, res, next) {
	try {
		let userId = req["x-api-key"].authorId;
		let blogId = req.params.blogId;
		let blog = await BlogModel.findById(blogId);
		if (blogId) {
			if (blog.authorId.toString() !== userId)
				return res.status(403).send({
					status: false,
					msg: "Unauthorised",
				});
		}
		next();
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

module.exports = { userAuthentication, userAuthorisation };
