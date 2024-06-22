const {AirplaneRepository} = require('../repositories')
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();

/* POST , api/v1/airplanes
req.body={modelNumber, capacity}*/ 

async function createAirplane (data) 
{
   try {
     const airplane = await airplaneRepository.create(data);
     return airplane;
   } catch (error) {
      if(error.name == 'SequelizeValidationError'){
         let explanation =[];
         error.errors.forEach((err)=> {
            explanation.push(err.message);
         });
         throw new AppError(explanation,StatusCodes.BAD_REQUEST);
      }
      throw new AppError('Cannot create a new Airplane',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/airplanes
req.body={}*/ 
async function getAirplanes () 
{
   try {
     const airplane = await airplaneRepository.getall();
     return airplane;
   } catch (error) {
      throw new AppError('Cannot fetch data of all Airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/airplanes/:id
req.body={}*/ 
async function getAirplane (id) 
{
   try {
     const airplane = await airplaneRepository.get(id);
     return airplane;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airplane you requested not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of Airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*DELETE , api/v1/airplanes/:id
req.body={}*/ 
async function destroyAirplane (id) 
{
   try {
     const airplane = await airplaneRepository.destroy(id);
     return airplane;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airplane you want to delete not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of all Airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*PATCH , api/v1/airplanes/:id
req.body={}*/ 
async function updateAirplane (id,data) 
{
   try {
     const airplane = await airplaneRepository.update(id,data);
     return airplane;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('Airplane you want to delete not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of all Airplanes',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}


module.exports = {
   createAirplane,
   getAirplanes,
   getAirplane,
   destroyAirplane,
   updateAirplane
}