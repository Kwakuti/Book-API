const slugify = require('slugify');
const mongoose = require('mongoose');
const mongooseValidators = require('mongoose-validators');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Book must have a title'],
        unique: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'Book must have a Description'],        
    },
    pages: {
        type: Number
    },
    isbnNumber: {
        type: String,
        required: [true, 'Book must have a ISBN-number'],
        validate: mongooseValidators.isISBN()
    },
    author:{
        required: [true, 'Book should have an author'],
        type: [mongoose.Schema.ObjectId],
        ref: 'Author'
    }, 
    image: {
        type: String
    },
    fileAddress: {
        type: String
    },
    format: {
        type: String,
        enum: ['epub', 'pdf', 'mobi'],
        default: 'pdf'
    }
});

bookSchema.pre('save', function(next) {
    if(!this.isNew) {
        if(this.isModified('title')) {
            this.slug = slugify(`${this.title}`.toLowerCase());
        }
        return next();
    }
    this.slug = slugify(`${this.title}`.toLowerCase());
    // console.log(this.author);
    return next()
});

bookSchema.pre(/^findOne/, function(next) {
    //Look for Update Query middleware to update the slug
    next()
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;