const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const validataRequest =  (req,res,next) =>{
     if(!req.body.modelNumber)
        {
            ErrorResponse.error = new AppError('Model Number not found in the incoming request in the correct form',StatusCodes.BAD_REQUEST);
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
        next();
} 
 module.exports = {
    validataRequest
 };