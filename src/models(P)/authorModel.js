// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }

const mongoose = require("mongoose");

const authorModel = mongoose.Schema(
  {
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    title: { type: String, enum: ["Mr", "Mrs", "Miss"] },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
  },
  { timeStamp: true }
);

module.exports=mongoose.model("Author(P)",authorModel)
