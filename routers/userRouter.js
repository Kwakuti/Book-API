const express = require('express');
const userController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter.get('/search', userController.searchUsers,);

userRouter.get('/',userController.getAllUsers)
        .post('/', userController.getOneUser)
        .delete('/', userController.deleteAllUser);

userRouter.get('/:id', userController.getOneUser)
        .patch('/:id', userController.uploadUpdateUserImage, userController.updateUser)
        .delete('/:id', userController.deleteMe);

module.exports = userRouter;