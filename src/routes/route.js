const express = require("express");
const router = express.Router();

const blogController = require("../controller/blogController(new)");
const authorController = require("../controller/authorController(new)");
const BlogValidation = require("../middleware/middleware");
const authUser = require("../middleware/auth");

// const authorController = require("../controller(P)/authorController(new)");
// const blogController = require("../controller(P)/blogController(new)");
// const middleware = require("../middleware(P)/middleware")
// const mid = require("../middlewareK/middleware")

// router.post("/authors",authorController.createAuthor)

// router.post("/login", authorController.authorLogin)

// router.post("/blogs",middleware.decodeFun, middleware.authorAuthorization1, blogController.createBlog)

// router.get("/blogs",middleware.decodeFun, middleware.authorAuthorization2,mid.BlogValidationFromQuery, blogController.getBlogs );

// router.put("/blogs/:blogId",middleware.decodeFun, middleware.authorAuthorization3, blogController.updateBlog);

// router.delete("/blogs/:blogId",middleware.decodeFun, middleware.authorAuthorization3, blogController.deleteBlogById);

// router.delete("/blogs",middleware.decodeFun, middleware.authorAuthorization4, blogController.deleteBlogByParams)

router.use("/blogs", authUser.userAuthentication);

router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.authorLogin);
router.post("/blogs", authUser.userAuthorisation, blogController.createBlog);
router.get("/blogs", BlogValidation.BlogValidationFromQuery, blogController.getBlogs);
router.put("/blogs/:blogId", authUser.userAuthorisation, blogController.updateBlog);

router.delete("/blogs/:blogId", authUser.userAuthorisation, blogController.deleteBlogById);

router.delete(
	"/blogs", authUser.userAuthorisation, BlogValidation.BlogValidationFromQuery, blogController.deleteFromQuery); //by query params

module.exports = router;
