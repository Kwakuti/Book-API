const CustomError = require('./../utils/CustomError');

//working but fails to catch errors emanating from mongo db
// module.exports = (myFunction) => {
//     return (request, response, next) => { 
//         try{
//             myFunction(request, response, next);
//         }catch(error) {
//             console.log(error);
//             next(new CustomError(400, error));
//         }
//     }
// }

//working perfectly
module.exports = (myFunction) => {
    return (request, response, next) => { 
        myFunction(request, response, next).catch((error) => { next(error) });
    }
}
