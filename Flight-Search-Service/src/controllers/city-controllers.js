const {CityService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse,SuccessResponse} = require('../utils/common');

/* POST , api/v1/cities
req.body={modelNumber, capacity}*/ 
async function createCity(req,res) {
   try {
      const city = await CityService.createCity({
        name:req.body.name
      })
      SuccessResponse.data = city;
      return  res.status(StatusCodes.CREATED).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*GET , api/v1/cities
req.body={}*/ 
async function getCities(req,res) {
   try {
      const city = await CityService.getCities()
      SuccessResponse.data = city;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};
/*GET , api/v1/cities/:id
req.body={}*/ 
async function getCity(req,res) {
   try {
      const city = await CityService.getCity(req.params.id)
      SuccessResponse.data = city;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*DELETE , api/v1/cities/:id
req.body={}*/ 
async function destroyCity(req,res) {
   try {
      const city = await CityService.destroyCity(req.params.id)
      SuccessResponse.data = city;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*PATCH , api/v1/cities/:id
req.body={name}*/ 
async function updateCity(req,res) {
   try {
      const city = await CityService.updateCity(req.params.id,{
         name:req.body.name,
       });
      SuccessResponse.data = city;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

module.exports = {
   createCity,
   getCities,
   getCity,
   destroyCity,
   updateCity
}