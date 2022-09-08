const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const validation = require("../validators/validator");

const createAuthor = async function (req, res) {
	try {
		const requestBody = req.body;

		// Extract Params
		const { fname, lname, title, email, password } = requestBody;

		//Validation starts
		//1.validation on fname
		if (!fname) {
			res.status(400).send({ status: false, msg: "fname required" });
			return;
		}
		if (!validation.isValidString(fname)) {
			res
				.status(400)
				.send({ status: false, msg: "fname must contain letters" });
			return;
		}

		//2.validation on lname
		if (!lname) {
			res.status(400).send({ status: false, msg: "lname required" });
			return;
		}
		if (!validation.isValidString(lname)) {
			res
				.status(400)
				.send({ status: false, msg: "lname must contain letters only" });
			return;
		}

		//3.validation on title
		if (!title) {
			res.status(400).send({ status: false, msg: "title required" });
			return;
		}
		if (!validation.isValidTitle(title)) {
			res.status(400).send({
				status: false,
				msg: "Title must contain only one of these-'Mr','Mrs','Miss'",
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
		if (!password) {
			res.status(400).send({ status: false, msg: "password must be present" });
			return;
		}
		if (password.length < 8 || password.length > 19) {
			res.status(400).send({
				status: false,
				mesg: "password must be in between 8 to 19 characters",
			});
			return;
		}

		if (!validation.isValidPassword(password)) {
			res.status(400).send({
				status: false,
				msg: "Password must contain uppercases,lowercase,special characters and numerics.",
			});
			return;
		}
		// Validation Ends

		const newAuthor = await authorModel.create(requestBody);
		res.status(201).send({
			status: true,
			mag: "Data created successfully",
			data: newAuthor,
		});
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

const authorLogin = async function (req, res) {
	try {
		const requestBody = req.body;
		const email = requestBody.email;
		const password = requestBody.password;
		const secretkey = "plutoniumFunctionup$%(())()*)+/";

		//Validation on email
		if (!email) {
			res.status(400).send({ status: false, msg: "email must be present" });
			return;
		}
		if (!validation.isValidEmail(email)) {
			res.status(400).send({ status: false, msg: "Invalid emailID" });
			return;
		}

		//validation on password
		if (!password) {
			res.status(400).send({ status: false, msg: "Password must be present" });
			console.log(password);
			return;
		}

		// Checking for authentication
		obj = {};
		obj.email = email;
		obj.password = password;
		const author = await authorModel.findOne(obj);
		if (!author) {
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
