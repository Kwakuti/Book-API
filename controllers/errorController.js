const CustomError = require('./../utils/CustomError');

const standardResponse = (response, error) => {
    return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        stack: error.stack
    });
}

const manageValidationError = (error) => {
    // let customValidatorTerms = ['isbnNumber', 'email'];
    let errorNames = [];
    let errorString = [];
    for(err in error.errors) {
        errorNames.push(err);
    }
    errorNames.forEach(name => {
        errorString.push(error.errors[name].message);
    })
    errorString[errorNames.indexOf('isbnNumber')] = 'Invalid ISBN Number; input valid ISBN-number';
    errorString[errorNames.indexOf('email')] = 'Invalid e-mail address; input valid e-mail address';
    return new CustomError(400, errorString.join(', '));
}

const manageDuplicateError = (error) => {
    let regExpression = /(["'])(?:(?=(\\?))\2.)*?\1/
    const bookTitle = `${error.message}`.match(regExpression)[0];
    return new CustomError(400, `Title: ${bookTitle} already exists... Use another title`);
}

const manageCastError = (error) => {
    return new CustomError(404, 'Invalid URL...')
}

const manageMulterUpladError = (error) => {
    // console.log(error);
    return new Credential(400, 'File Location xyz doe not exist');
}

module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Internal Error';
    
    console.log(error);
    
    if(error.code == 11000) error = manageDuplicateError(error);
    //Casted Error not ctaching error from wrong inserted value of author in book
    if(error.name == "CastError") error = manageCastError(error);
    if(error.name == "ValidationError") error = manageValidationError(error);
    // if(error.code == "ENOENT" || error.syscall == 'open') error = manageMulterUpladError(error);
    standardResponse(response, error);
}
