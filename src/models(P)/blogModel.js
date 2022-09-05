const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

// { title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}

const blogModel = mongoose.Schema({
  tile: { type: String, require: true },
  body: { type: String, require: true },
  authorId: { type: objectId, ref: "Author" },
  tags: { type: [String], require: true },
  category: { type: String, require: true },
  subcategory: { type: [String] },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  publishedAt: { type: Date },
  isPublished: { type: Boolean, default: false },
});

module.exports=mongoose.model("Blogs(P)",blogModel)