const {AirportRepository} = require('../repositories')
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const airportRepository = new AirportRepository();

/* POST , api/v1/airports
req.body={name, address,code,cityId}*/ 

async function createAirport (data) 
{
   try {
     const airport = await airportRepository.create(data);
     return airport;
   } catch (error) {
      if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
         let explanation =[];
         error.errors.forEach((err)=> {
            explanation.push(err.message);
         });
         throw new AppError(explanation,StatusCodes.BAD_REQUEST);
      }
      throw new AppError('Cannot create a new Airport',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/airports
req.body={}*/ 
async function getAirports () 
{
   try {
     const airport = await airportRepository.getall();
     return airport;
   } catch (error) {
      throw new AppError('Cannot fetch data of all Airports',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/airports/:id
req.body={}*/ 
async function getAirport (id) 
{
   try {
     const airport = await airportRepository.get(id);
     return airport;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airport you requested not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of Airports',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*DELETE , api/v1/airports/:id
req.body={}*/ 
async function destroyAirport (id) 
{
   try {
     const airport = await airportRepository.destroy(id);
     return airport;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airport you want to delete not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of all Airports',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*PATCH , api/v1/airports/:id
req.body={name, address,code,cityId}*/ 
async function updateAirport (id,data) 
{
   try {
     const airport = await airportRepository.update(id,data);
     return airport;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airport you want to delete not found',StatusCodes.NOT_FOUND);
         }
         if(error.name == 'SequelizeUniqueConstraintError')
            {
               let explanation =[];
               error.errors.forEach((err)=> {
               explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
            }
      throw new AppError('Cannot fetch data of all Airports',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}


module.exports = {
   createAirport,
   getAirports,
   getAirport,
   destroyAirport,
   updateAirport
}