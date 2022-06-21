const mongoose = require('mongoose');
const slugify = require('slugify')

const authorSchema = new mongoose.Schema({
    fullName: { 
        type: String,
        min: 2,
        required: [true, 'Author must have a full-name'],
        unique: true
    },
    slug: {
        type: String,
        select: false
    },
    books: {
        type: [String]
    }
});

authorSchema.pre('pre', function(next) {
    this.slug = slugify(this.fullName);
    next();
});

authorSchema.pre('updateOne', function(next) {
    if(this.isModified('fullName')) {
        this.slug = slugify(this.fullName);
    }
    next();
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;