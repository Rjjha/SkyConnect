const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */
async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}
/**
 * POST : /signin 
 * req-body {email: 'a@b.com', password: '1234'}
 * header {x-access-token : token}
 */
async function signin(req, res) {
    try {
        console.log(req.body);
        const user = await UserService.signIn({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}
/**
 * POST : /role
 * req-body {role: 'admin', id: '3'}
 */
async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getUser(req,res) {
    try {
       const user = await UserService.getUser(req.params.id)
       SuccessResponse.data = user;
       return  res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
 };

module.exports = {
    signup,
    signin,
    addRoleToUser,
    getUser
}