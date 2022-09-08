const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
let arr = ["Mr", "Mrs", "Miss"];
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
	"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})";

const isValidRequestBody = function (data) {
	if (Object.keys(data).length == 0) return false;
	return true;
};

const isValidString = function (data) {
	if (typeof (data != "string" || data.trim().length == 0)) {
		return false;
	}
	return true;
};

const isValidObjectId = function (data) {
	return ObjectId.isValid(data);
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

const isValid = function (value) {
	if (typeof value === "undefined" || value === null) return false;
	if (typeof value === "string" && value.trim().length === 0) return false;
	return true;
};

module.exports = {
	isValid,
	isValidEmail,
	isValidObjectId,
	isValidPassword,
	isValidRequestBody,
	isValidString,
	isValidTitle,
};
