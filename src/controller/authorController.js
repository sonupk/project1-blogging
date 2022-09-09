const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const validation = require("../validators/validator");

const createAuthor = async function (req, res) {
	try {
		const { fname, lname, title, email, password } = req.body;

		//1.validation on fname
		if (!fname)
			return res.status(400).send({ status: false, msg: "fname required" });
		if (!validation.isValidString(fname))
			return res
				.status(400)
				.send({ status: false, msg: "fname must contain letters" });

		//2.validation on lname
		if (!lname)
			return res.status(400).send({ status: false, msg: "lname required" });
		if (!validation.isValidString(lname))
			return res
				.status(400)
				.send({ status: false, msg: "lname must contain letters only" });

		//3.validation on title
		if (!title)
			return res.status(400).send({ status: false, msg: "title required" });
		if (!validation.isValidTitle(title))
			return res.status(400).send({
				status: false,
				msg: "Title must contain only one of these-'Mr','Mrs','Miss'",
			});

		//4.validation on email
		if (!email)
			return res
				.status(400)
				.send({ status: false, msg: "email must be present" });
		if (!validation.isValidEmail(email))
			return res.status(400).send({ status: false, msg: "Invalid emailID" });
		const repeatEmail = await authorModel.find({ email: email });
		if (repeatEmail.length !== 0)
			return res
				.status(400)
				.send({ status: false, msg: "email ID already exist" });

		//5.validation on password
		if (!password)
			return res
				.status(400)
				.send({ status: false, msg: "password must be present" });
		if (password.length < 8 || password.length > 19)
			return res.status(400).send({
				status: false,
				mesg: "password must be in between 8 to 19 characters",
			});
		if (!validation.isValidPassword(password))
			return res.status(400).send({
				status: false,
				msg: "Password must contain uppercases,lowercase,special characters and numerics.",
			});

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
		const { email, password } = req.body;
		const secretkey = "plutoniumFunctionup$%(())()*)+/";

		//Validation on email
		if (!email)
			return res
				.status(400)
				.send({ status: false, msg: "email must be present" });
		if (!validation.isValidEmail(email))
			return res.status(400).send({ status: false, msg: "Invalid emailID" });

		//validation on password
		if (!password)
			return res
				.status(400)
				.send({ status: false, msg: "Password must be present" });

		// Checking for authentication
		obj = {};
		obj.email = email;
		obj.password = password;
		
		const author = await authorModel.findOne(obj);
		if (!author)
			return res
				.status(400)
				.send({ status: false, msg: "Invalid Credentials" });

		const token = jwt.sign({ authorId: author._id.toString() }, secretkey);
		res.status(200).send({ status: true, data: token });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

module.exports = { createAuthor, authorLogin };
