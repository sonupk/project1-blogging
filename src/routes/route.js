const express = require("express");
const router = express.Router();

const controller = require("../controllerK/controller");
const middleware = require("../middlewareK/middleware");

router.get("/blogs", middleware.getBlogValidation, controller.getBlogs);

module.exports = router;
