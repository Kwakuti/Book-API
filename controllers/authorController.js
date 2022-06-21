const factory = require('./handlerFactory');
const tryCatch = require('./../utils/tryCatch');
const Author = require('./../models/authorModel');

exports.createAuthor = tryCatch(factory.createOne(Author));

exports.getAllAuthors = tryCatch(factory.getAll(Author, '-books -__v' ));

exports.getAuthor = tryCatch(factory.getOne(Author));

exports.updateAuthor = tryCatch(factory.updateOne(Author));

exports.deleteAuthor = tryCatch(factory.deleteOne(Author));

exports.deleteAllAuthor = tryCatch(factory.deleteAll(Author));