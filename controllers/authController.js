const User = require('./../models/userModel');
const tryCatch = require('./../utils/tryCatch');
const CustomError = require('./../utils/CustomError');

const emailValideRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const INVALID_USERNAME_PASSWORD = 'Invalid email/username and password...';


exports.signUp = tryCatch(async (request, response, next) => {
    const newUser = await User.create({
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        passwordConfirm: request.body.passwordConfirm,
    });    
    if(!newUser) { return next(400, 'Failed to Sign Up'); }
    return response.status(201).json({
        status: 201,
        data: {
            user: newUser
        }
    });
});

exports.login = tryCatch(async (request, response, next) => {
    let user;
    if(!request.body.email || !request.body.password) {  
        return next(new CustomError(400, INVALID_USERNAME_PASSWORD)); 
    }
    if(emailValideRegEx.test(request.body.email)) {
        user = await User.findOne({ email: request.body.email })
    }else {
        user = await User.findOne({ username: request.body.email });
    }
    if(!user) {
         return  next(new CustomError(400, INVALID_USERNAME_PASSWORD)); 
    }
    let verificationStatus = user.verifyPasswords(request.body.password, user.password);
    if(!verificationStatus) { return new CustomError(400, INVALID_USERNAME_PASSWORD); }
    return response.status(201).json({
        status: 200,
        message: `Successful Login, Welcome ${user.name}..`
    });
});

exports.forgotPassword = tryCatch(async (request, response, next) => {
    if(!request.body.email || !emailValideRegEx.test(request.body.email)) {  
        return next(new CustomError(400, INVALID_USERNAME_PASSWORD)); 
    }
    let user = await User.findOne({ email: request.body.email });
    if(!user) {
        return next(new CustomError(400, 'Invalid e-mail...')); 
    }
    let resetValue = await user.createRestToken(Date.now());
    //send email with reset value
    console.log(resetValue);
    return response.status(201).json({
        status: 200,
        message: `Please, check your e-mail: ${request.body.email} for reset link.`
    });
});

exports.resetPassword = tryCatch(async (request, response, next) => {
    if(!request.body.password || !request.body.passwordConfirm) {
        return next(new CustomError(400, 'Invalid password and confirm password'));
    }
    const userToReset = await User.findOne({ resetToken: request.params.resetToken}); 
    if(!userToReset) {
        return next(new CustomError(400, 'Invalid User...')); 
    }
    if(Date.now() > userToReset.resetTokenExpires) {
        await userToReset.invalidateResetToken();
        return next(new CustomError(400, 'Expired Reset Token...')); 
    }
    await userToReset.updatePassword(request.body);
    return response.status(201).json({
        status: 201,
        message: `Password Reset successfully...`
    });
})