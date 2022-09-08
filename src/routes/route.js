const express = require("express");
const router = express.Router();


const authorController = require("../controller(P)/authorController(new)");
const blogController = require("../controller(P)/blogController(new)");
const middleware = require("../middleware(P)/middleware")
const mid = require("../middlewareK/middleware")

router.post("/authors",authorController.createAuthor)

router.post("/login", authorController.authorLogin)

router.post("/blogs",middleware.decodeFun, middleware.authorAuthorization1, blogController.createBlog)

router.get("/blogs",middleware.decodeFun, middleware.authorAuthorization2,mid.BlogValidationFromQuery, blogController.getBlogs );

router.put("/blogs/:blogId",middleware.decodeFun, middleware.authorAuthorization3, blogController.updateBlog);

router.delete("/blogs/:blogId",middleware.decodeFun, middleware.authorAuthorization3, blogController.deleteBlogById);

router.delete("/blogs",middleware.decodeFun, middleware.authorAuthorization4, blogController.deleteBlogByParams)


module.exports = router;
