const express = require('express');
const morgan = require('morgan');

const app = express();

const bookRouter = require('./routers/bookRouter');
const CustomError = require('./utils/CustomError');
const authorRouter = require('./routers/authorRouter');
const authRouter = require('./routers/authRouter.js');
const errorController = require('./controllers/errorController');


app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public/img/book-files`));

app.use('/api/books', bookRouter);

app.use('/api/authors', authorRouter);

app.use('/api/auth', authRouter);

app.use('*', (request, response, next) => {
    next(new CustomError(404, 'Page does not exist'));
});

app.use(errorController);

module.exports = app;
