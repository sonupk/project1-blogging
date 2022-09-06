const express = require('express');
const router = express.Router();

const authorBody = require('../middleware/authorMiddleware')
const authorController = require('../controller/authorController')


router.post('/authors',authorBody.AuthorBody,authorController.CreateAuthor)

module.exports = router;  