const express = require("express");
const router = express.Router();

const authorController = require("../controller(P)/authorController");
const blogController = require("../controller(P)/blogController");
const getBlog = require("../controllerK/controller");
const getBlogValidation = require("../middlewareK/middleware");

router.post("/authors", authorController.createAuthor);
router.post("/blogs", blogController.createBlog);
router.get("/blogs", getBlogValidation.getBlogValidation, getBlog.getBlogs);

module.exports = router;
