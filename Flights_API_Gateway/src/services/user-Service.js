const {StatusCodes} = require('http-status-codes');
const { UserRepository,RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {Auth,Enums} = require('../utils/common');

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function create(data){
    try {
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.USER_ROLES.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function signIn(data){
    try {
        const user = await userRepo.getUserByEmail(data.email);
        if(!user)
            {
                throw new AppError('No User found with this email',StatusCodes.NOT_FOUND);
            }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch)
            {
                throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
            }
        const jwt = Auth.createToken({id:user.id,email:user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError){ 
            throw error;
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAuthenticated(token){
    try {
        if(!token)
            {
                throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
            }
        const response = Auth.verifyToken(token);
        const user = await userRepo.get(response.id);
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function addRoletoUser(data) {
    try {
        const user = await userRepo.get(data.id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if(!role) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAdmin(id) {
    try {
        const user = await userRepo.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepo.getRoleByName(Enums.USER_ROLES.ADMIN);
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isFlightCompany(id) {
    try {
      const user = await userRepo.get(id);
      if (!user) {
        throw new AppError(
          "For the given id, no users were found",
          StatusCodes.NOT_FOUND
        );
      }
      const flight_companyrole = await roleRepo.getRoleByName(FLIGHT_COMPANY);
  
      return user.hasRole(flight_companyrole); // hasRole() is a magic method inside sequelize | LINK -> https://medium.com/@julianne.marik/sequelize-associations-magic-methods-c72008db91c9
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        "INTERNAL SERVER ERROR | Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /*GET , api/v1/airplanes/:id
req.body={}*/ 
async function getUser(id) 
{
   try {
     const airplane = await userRepo.get(id);
     return airplane;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airplane you requested not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of Airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}
module.exports ={
    create,
    signIn,
    isAuthenticated,
    addRoletoUser,
    isAdmin,
    isFlightCompany,
    getUser,
}