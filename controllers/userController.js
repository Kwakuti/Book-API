const multer = require('multer');

const factory = require('./handlerFactory');
const User =  require('./../models/userModel');
const tryCatch = require('./../utils/tryCatch');
const CustomError = require('../utils/CustomError');

exports.getAllUsers = tryCatch(factory.getAll(User));

exports.getOneUser = tryCatch(factory.getOne(User));

exports.deleteUser = tryCatch(factory.deleteOne(User));

exports.deleteMe = tryCatch(() => {
    
});

exports.updateUser = tryCatch(() => {
    
});

exports.deleteAllUser = tryCatch(factory.deleteAll(User));

exports.searchUsers = () => {}

const userImageFilter = (request, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback(null,true);
    }else {
        callback(new CustomError(400, 'Attempt to upload invalid file type. Only iImages can be uploaded'), false);
    }
};

const userStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null,'/public/img/users');
    },
    filename: (request, file, callback) => {
        const extention = request.file.split('/')[1];
        callback(null,`user-${Date.now()}-${request.user.id}.${extention}`);
    }
})

exports.uploadUpdateUserImage = multer({
    fileFilter: userImageFilter,
    storage: userStorage
}).single('image');