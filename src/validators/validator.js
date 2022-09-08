const mongoose = require("mongoose");
let arr = ["Mr", "Mrs", "Miss"];
const ObjectId = mongoose.Types.ObjectId;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,19})/;

const isValidRequestBody = function (data) {
	if (Object.keys(data).length == 0) return false;
	return true;
};

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
	return arr.includes(data);
};

const isValidEmail = function (data) {
	return emailRegex.test(data);
};

const isValidPassword = function (data) {
	return passwordRegex.test(data);
};

const makeArray = function (data) {
	let arrayOfInput = data
		.split(",")
		.map((x) => x.trim())
		.filter((x) => x.trim().length > 0);
	return arrayOfInput;
};

const flattenArray = function (data) {
	let arrayOfInput = data
		.map((x) => [x.split(",").map((x) => x.trim())])
		.flat(Infinity);
	return arrayOfInput;
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

module.exports = {
	isValidEmail,
	isValidObjectId,
	isValidPassword,
	isValidRequestBody,
	isValidString,
	isValidTitle,
	isValidArray,
	makeArray,
	flattenArray,
};
