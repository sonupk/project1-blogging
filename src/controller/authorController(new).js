const { request } = require("express");
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const secretkey = "plutoniumFunctionup$%(())()*)+/";
const validation = require("../validators/validator");

const createAuthor = async function (req, res) {
	try {
		const requestBody = req.body;

		// Extract Params
		const { fname, lname, title, email, password } = requestBody;

		//Validation starts
		//1.validation on fname
		if (!validation.isValidString(fname)) {
			res.status(400).send({ status: false, msg: "fname is required" });
			return;
		}

		//2.validation on lname
		if (!validation.isValidString(lname)) {
			res.status(400).send({ status: false, msg: "lname is required" });
			return;
		}

		//3.validation on title
		if (!validation.isValidTitle(title)) {
			res
				.status(400)
				.send({
					status: false,
					msg: "Title must be one of these-'Mr','Mrs','Miss'",
				});
			return;
		}

		//4.validation on email
		if (!email) {
			res.status(400).send({ status: false, msg: "email must be present" });
			return;
		}
		if (!validation.isValidEmail(email)) {
			res.status(400).send({ status: false, msg: "Invalid emailID" });
			return;
		}
		const repeatEmail = await authorModel.find({ email: email });
		if (repeatEmail.length !== 0) {
			res.status(400).send({ status: false, msg: "email ID already exist" });
			return;
		}

		//5.validation on password
		if (!validation.isValidPassword(password)) {
			res.status(400).send({
				status: false,
				msg: "password must contain alteast one number and one special character.",
			});
			return;
		}
		// Validation Ends
		const newAuthor = await authorModel.create(requestBody);
		res
			.status(201)
			.send({
				status: true,
				mag: "Data created successfully",
				data: newAuthor,
			});
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

// ### POST /login
// - Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId in response body like [this](#Successful-login-Response-structure)
// - If the credentials are incorrect return a suitable error message with a valid HTTP status code

const authorLogin = async function (req, res) {
	try {
		const requestBody = req.body;
		const email = requestBody.email;
		const password = request.password;

		// Checking for authentication

		obj = {};
		obj.email = email;
		obj.password = password;
		const author = await authorModel.findOne(obj);
		if (author.length == 0) {
			res.status(400).send({ status: false, msg: "Invalid Credentials" });
			return;
		}
		const token = jwt.sign({ authorId: author._id.toString() }, secretkey);
		res.status(200).send({ status: true, data: token });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

module.exports = { createAuthor, authorLogin };
