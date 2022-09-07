const express = require("express");
const router = express.Router();

const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");
const getBlog = require("../controller/blogController(new)");
const BlogValidation = require("../middleware/middleware");
const authUser = require("../middleware/auth");

router.use("/blogs", authUser.userAuthentication);

router.post("/authors", authorController.createAuthor);
router.post("/blogs", authUser.userAuthorisation, blogController.createBlog);
router.get("/blogs", BlogValidation.BlogValidationFromQuery, getBlog.getBlogs);
router.delete(
	"/blogs/:blogId",
	authUser.userAuthorisation,
	getBlog.deleteBlogById
);
router.delete(
	"/blogs",
	authUser.userAuthorisation,
	BlogValidation.BlogValidationFromQuery,
	getBlog.deleteFromQuery
); //by query params

module.exports = router;
