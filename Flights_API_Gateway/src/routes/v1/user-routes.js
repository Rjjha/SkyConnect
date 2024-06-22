const express = require('express');
const { UserController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');
const router = express.Router();

/*GET , api/v1/user/:id
req.body={}*/ 
router.get('/:id',
    UserController.getUser
 )
 

/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */
router.post('/signup',AuthMiddleware.validateAuthRequest, UserController.signup);

/**
 * POST : /signin 
 * req-body {email: 'a@b.com', password: '1234'}
 */
router.post('/signin',AuthMiddleware.validateAuthRequest, UserController.signin);

/**
 * POST : /role
 * req-body {role: 'admin', id: '3'}
 * header {x-access-token : token}
 */
router.post('/role',AuthMiddleware.validateAddRoleRequest,AuthMiddleware.checkAuth, AuthMiddleware.isAdmin, UserController.addRoleToUser);
module.exports = router;