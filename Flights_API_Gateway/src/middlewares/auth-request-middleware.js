const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService} = require('../services');

function validateAuthRequest(req, res, next) {
    if(!req.body.email) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['Email not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    if(!req.body.password) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['password not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response) {
            req.user = response; 
            next();
        }
    } catch(error) {
        return res
                .status(error.statusCode)
                .json(error);
    }
    
}

async function isAdmin(req, res, next) {
    const response = await UserService.isAdmin(req.user);
    if(!response) {
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: 'User not authorized for this action'});
    }
    next();
}

async function checkFlightCompany(req, res, next) {
    try {
      const response = await UserService.isFlightCompany(req.user.id);
      if (response) {
        next();
      }
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "User not authorized to perform the action" });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json(error);
    }
  }
  
  function validateAddRoleRequest(req, res, next) {
    if (!req.body.role) {
      ErrorResponse.message = "Failed to add a role to the user";
      ErrorResponse.error = new AppError(
        ["The Role was not found in the incoming request"],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if (!req.body.id) {
      ErrorResponse.message = "Failed to add a role to the user";
      ErrorResponse.error = new AppError(
        ["The User ID was not found in the incoming request"],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
  }
  
  async function checkRights(req, res, next) {
    const response1 = await UserService.isAdmin(req.user.id);
    const response2 = await UserService.isFlightCompany(req.user.id);
    console.log(req.method, response1, response2);
    if (req.method === "GET" || response1 || response2) {
      return next();
    } else {
      // Deny access for non-admin users trying to perform create, update or delete operations
      ErrorResponse.message = "Access denied";
      ErrorResponse.explanation = "User is not authorized to perform this action";
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
    }
  }
  
module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin,
    checkRights,
    validateAddRoleRequest,
    checkFlightCompany
}