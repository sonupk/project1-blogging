const express = require("express");
const router = express.Router();


const authorController = require("../controller(P)/authorController");
const blogController = require("../controller(P)/blogController");
const getBlog = require("../controllerK/controller");
const BlogValidation = require("../middlewareK/middleware");
const authUser=require("../authK/auth")

router.use("/blogs",authUser.userAuthentication)

router.post("/authors", authorController.createAuthor);
router.post("/blogs", blogController.createBlog);
router.get("/blogs", BlogValidation.BlogValidationFromQuery, getBlog.getBlogs);
router.delete("/blogs/:blogId",authUser.userAuthorisation, getBlog.deleteBlogById);

module.exports = router;
