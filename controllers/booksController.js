const multer = require('multer');
const MiniSearch = require('minisearch');

const factory = require('./handlerFactory');
const Book =  require('./../models/bookModel');
const tryCatch =  require('./../utils/tryCatch');
const CustomError = require('../utils/CustomError');

const multerStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'public/img/book-files');
    },
    filename: (request, file, callback) => {
        const fileExtension = file.mimetype.split('/')[1];        
        callback(null, `books-${Date.now()}.${fileExtension}`);
    }
});

const multerFilter = (req, file, callback) => {
    const fileExtension = file.mimetype.split('/')[1];        
    const fileType = ['epub', 'pdf', 'mobi', 'epub+zip']
    if(fileType.includes(fileExtension)) {
        if(fileExtension == 'epub+zip') {
            file.mimetype = 'application/epub';    
        }
        callback(null, true);
    }else {
        callback(new CustomError(400, 'Only books can be uploaded here...') , false);
    }
}

const upload = multer({
    fileFilter: multerFilter,
    storage: multerStorage
})

exports.uploadBook = upload.single('fileAddress');

// exports.uploadBook = upload.array([ { fieldName: 'fileAddress', maxCount: 1 },
//                                     { fieldName: 'image', maxCount: 1 }]);


exports.getAllBooks = tryCatch(factory.getAll(Book));

exports.getOneBook = tryCatch(factory.getOne(Book));

exports.createBook = tryCatch( async(request, response, next) => {
    let book = await Book.create({
        title: request.body.title,
        description: request.body.description,
        pages: request.body.pages, 
        isbnNumber: request.body.isbnNumber,
        author: request.body.author,
        image: request.body.image, 
        fileAddress: request.file.path,
        format: request.file.mimetype.split('/')[1]
    });

    if(!book) { return next(new CustomError(400, 'Error Occured while creating document...')) }
    return response.status(201).json({
        status: 201,
        data: { book }
    });
} );

exports.updateBook = tryCatch(factory.updateOne(Book));

exports.deleteBook = tryCatch(factory.deleteOne(Book));

exports.deleteAllBook = tryCatch(factory.deleteAll(Book));

exports.searchBooks = tryCatch(factory.search(Book, {field:  ['title'], storeField:  ['title', 'format', 'image'] }));

//something is wrong here
exports.downloadBook = tryCatch(async (request, response, next) => {
    if(request.user) {}
    if(!request.params.bookId) { return next(new CustomError(400, 'Invalid URL...')) }
    const book = await Book.findOne({ _id: request.params.bookId });
    if(!book) { return next(new CustomError(400, 'Book does not exisit...')) }
    console.log(book.fileAddress.split(`\`));
    return response.status(200).json({
        message: 'success',
        downloadUrl: `${request.hostname}/${book.fileAddress.split('/')[2]}`
    })
});

// http://127.0.0.1:3000/img/book-files/books-1655550069361.epub

// exports.searchBooks = tryCatch(async (request, response, next) => {
//     let miniSearch = new MiniSearch({
//         fields: ['title'],
//         storeFields: ['title', 'format', 'image']
//       });
//     const searchResults = miniSearch.search(request.query.q);
//     console.log(searchResults);
//     return response.status(200).json({
//         length: searchResults.length,
//         data: {
//             results: searchResults
//         }
//     });
// });