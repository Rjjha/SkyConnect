const {CityRepository} = require('../repositories')
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const cityRepository = new CityRepository();

/* POST , api/v1/cities
req.body={modelNumber, capacity}*/ 

async function createCity (data) 
{
   try {
     const city = await cityRepository.create(data);
     return city;
   } catch (error) {
      if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError' ){
         let explanation =[];
         error.errors.forEach((err)=> {
            explanation.push(err.message);
         });
         throw new AppError(explanation,StatusCodes.BAD_REQUEST);
      }
      throw new AppError('Cannot create a new City',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/cities
req.body={}*/ 
async function getCities() 
{
   try {
     const city = await cityRepository.getall();
     return city;
   } catch (error) {
      throw new AppError('Cannot fetch data of all Cities',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*GET , api/v1/cities/:id
req.body={}*/ 
async function getCity(id) 
{
   try {
     const city = await cityRepository.get(id);
     return city;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('City you requested not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of City',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*DELETE , api/v1/cities/:id
req.body={}*/ 
async function destroyCity (id) 
{
   try {
     const city = await cityRepository.destroy(id);
     return city;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('City you want to delete not found',StatusCodes.NOT_FOUND);
         }
      throw new AppError('Cannot fetch data of City',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

/*PATCH , api/v1/cities/:id
req.body={}*/ 
async function updateCity (id,data) 
{
   try {
     const city = await cityRepository.update(id,data);
     return city;
   } catch (error) {
      if(error.statusCode == StatusCodes.NOT_FOUND)
         {
            throw new AppError('City you want to delete not found',StatusCodes.NOT_FOUND);
         }
      if(error.name == 'SequelizeUniqueConstraintError')
         {
            let explanation =[];
            error.errors.forEach((err)=> {
            explanation.push(err.message);
         });
         throw new AppError(explanation,StatusCodes.BAD_REQUEST);
         }
      throw new AppError('Cannot fetch data of city',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}


module.exports = {
   createCity,
   getCities,
   getCity,
   destroyCity,
   updateCity
}