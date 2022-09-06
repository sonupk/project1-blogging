const express = require('express');
const router = express.Router();

const authorBody = require('../middlewarePR/authorMiddleware')
const authorController = require('../controllerPR/authorController')


router.post('/authors',authorBody.AuthorBody,authorController.CreateAuthor)

module.exports = router;  