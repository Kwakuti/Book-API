const multer = require('multer');
const express = require('express');

const bookController = require('./../controllers/booksController');

const bookRouter = express.Router();


bookRouter.get('/search', bookController.searchBooks,);

bookRouter.get('/dowload/:bookId', bookController.downloadBook,);

// {{URL}}/api/books/dowload/62adb075d414b577e3d939b8/public/img/book-files/books-1655550069361.epub

bookRouter.get('/',bookController.getAllBooks)
        .post('/', bookController.uploadBook, bookController.createBook)
        .delete('/', bookController.deleteAllBook);

bookRouter.get('/:id', bookController.getOneBook)
        .patch('/:id', bookController.updateBook)
        .delete('/:id', bookController.deleteBook);

module.exports = bookRouter;