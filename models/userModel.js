const slugify = require('slugify');
const mongoose = require('mongoose');

const emailValideRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'User must have a name'],
    },
    email: {
        type: String,
        required: [true, 'User  have confirm password'],
        unique: true,
        validate: function(emailValue) {
            return emailValideRegEx.test(emailValue);
        }
    },
    username: {
        type: String,
        required: [true, 'User  have confirm password'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User  have confirm password']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must password'],
        validate: function(passwordConfirmValue) {
            return this.password == passwordConfirmValue;
        }
    },
    image: {
        type: String
    },
    resetToken: { type: String},
    resetTokenExpires: { type: Date}
});

userSchema.methods.verifyPasswords = function(passwordInput, actualPassword) {
    return passwordInput == actualPassword;
}

userSchema.methods.createRestToken = async function(date) {
    //generate reset token;
    this.resetToken =  'genereated-rest-token';
    this.resetTokenExpires =  date + (0.5 * 60 * 1000);
    await this.save();
    return this.resetToken;
}

userSchema.methods.invalidateResetToken = async function() {
    this.resetToken =  undefined;
    this.resetTokenExpires = undefined;
    await this.save();
}

userSchema.methods.updatePassword = async function(requestBody) {
    this.password = requestBody.password;
    this.passwordConfirm = requestBody.passwordConfirm;
    this.resetToken =  undefined;
    this.resetTokenExpires = undefined;
    await this.save();
}

const User = mongoose.model('User', userSchema);

module.exports = User;