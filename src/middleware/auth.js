const jwt = require("jsonwebtoken");
const BlogModel = require("../models/blogModel");
const Validation = require("../validators/validator")

const userAuthentication = async function (req, res, next) {
	try {
		const secretkey = "plutoniumFunctionup$%(())()*)+/";
		let token = req.headers["x-api-token"];
		if (!token){
			return res.status(401).send({ status: false, msg: "Please provide a token" });
		}
		let decodedToken = await jwt.verify(token, secretkey, (err,result) => {
			if (err) return res.status(401).send(err.message);
			req["x-api-key"] = result;
			next();
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

// / ==> Authorization middleware function for PUT api and DELETE api by blogId in the path params
const userAuthorisation = async function (req, res, next) {
	try {
		let authorId = req["x-api-key"].authorId;
		let blogId = req.params.blogId;
		let authorIdFromBody =req.body.authorId

		
		if (blogId) {
			//Validation for blogId
			if(!Validation.isValidObjectId(blogId)){
				res.status(400).send({status:false, msg:"Invalid blogID"})
				return
			}

			let blog = await BlogModel.findById(blogId);
			if(!blog||blog["isDeleted"]==true){
				res.status(404).send({status:false, msg:"No blog found"})
				return
			}
			
			if (blog.authorId.toString() !== authorId)
				return res.status(403).send({
					status: false,
					msg: "Unauthorised",
				});
		}
		if(authorIdFromBody){
			if(!Validation.isValidObjectId(authorIdFromBody)){
				res.status(400).send({status:false, msg:"Invalid authorID"})
				return
			}
			if(authorId!=authorIdFromBody){
				return res.status(403).send({
					status: false,
					msg: "Unauthorised",
				});
			}
		}
		
		next();
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

module.exports = { userAuthentication, userAuthorisation };
