const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const isValidObjectId = function (data) {
	return ObjectId.isValid(data);
};

const isValidString = function (data) {
	if (typeof data != "string" || data.trim().length == 0) {
		return false;
	}
	return true;
};

const isValidTitle = function (data) {
	let arr = ["Mr", "Mrs", "Miss"];
	return arr.includes(data);
};

const isValidEmail = function (data) {
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(data);
};

const isValidPassword = function (data) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,19})/;
	return passwordRegex.test(data);
};

const isValidArray = function (data) {
	if (
		!Array.isArray(data) ||
		data.length == 0 ||
		data.includes(undefined) ||
		data.filter((x) => x.trim().length > 0).length == 0
	) {
		return false;
	}
	return true;
};

const makeArray = function (data) {
	let arrayOfInput = data
		.split(",")
		.map((x) => x.trim())
		.filter((x) => x.length > 0);
	return arrayOfInput;
};

const flattenArray = function (data) {
	let arrayOfInput = data
		.map((x) => [x.split(",").map((x) => x.trim())])
		.flat(Infinity)
		.filter((x) => x.length > 0);
	return arrayOfInput;
};

module.exports = {
	isValidEmail,
	isValidObjectId,
	isValidPassword,
	isValidString,
	isValidTitle,
	isValidArray,
	makeArray,
	flattenArray,
};
