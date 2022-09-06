const express = require('express');
const router = express.Router();

// const authorBody = require('../middlewarePR/authorMiddleware')
const authorController = require('../controller(P)/authorController')
const blogController = require("../controller(P)/blogController")

router.post('/authors',authorController.createAuthor)
router.post("/blogs",blogController.createBlog)


module.exports = router;  