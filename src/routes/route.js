const express = require("express");
const router = express.Router();

const blogController = require("../controller/blogController(new)");
const authorController = require("../controller/authorController(new)");
const BlogValidation = require("../middleware/middleware");
const authUser = require("../middleware/auth");

router.use("/blogs", authUser.userAuthentication);

router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.authorLogin);
router.post("/blogs", authUser.userAuthorisation, blogController.createBlog);
router.get("/blogs", BlogValidation.BlogValidationFromQuery, getBlog.getBlogs);
router.put(
	"/blogs/:blogId",
	authUser.userAuthorisation,
	blogController.updateBlog
);
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
