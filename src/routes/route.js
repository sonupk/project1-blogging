const express = require("express");
const router = express.Router();

const blogController = require("../controller/blogController");
const authorController = require("../controller/authorController");
const BlogValidation = require("../middleware/middleware");
const authUser = require("../middleware/auth");

router.use("/blogs", authUser.userAuthentication);

router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.authorLogin);
router.post(
	"/blogs",
	authUser.userAuthorisation,
	BlogValidation.createBlogValidation,
	BlogValidation.BlogValidation,
	blogController.createBlog
);
router.get(
	"/blogs",
	BlogValidation.BlogValidationFromQuery,
	blogController.getBlogs
);
router.put(
	"/blogs/:blogId",
	authUser.userAuthorisation,
	BlogValidation.BlogValidation,
	blogController.updateBlog
);
router.delete(
	"/blogs/:blogId",
	authUser.userAuthorisation,
	blogController.deleteBlogById
);
router.delete(
	"/blogs",
	authUser.userAuthorisation,
	BlogValidation.BlogValidationFromQuery,
	blogController.deleteFromQuery
);

module.exports = router;
