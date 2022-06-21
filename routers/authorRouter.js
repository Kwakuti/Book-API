const express = require('express');

const authorController = require('./../controllers/authorController');

const authorRouter = express.Router({ mergeParams: true });

authorRouter.get('/',authorController.getAllAuthors)
        .post('/', authorController.createAuthor)
        .delete('/', authorController.deleteAllAuthor);

authorRouter.get('/:id', authorController.getAuthor)
        .patch('/:id', authorController.updateAuthor)
        .delete('/:id', authorController.deleteAuthor);

module.exports = authorRouter;