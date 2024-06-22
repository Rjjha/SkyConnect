const {AirPlaneService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse,SuccessResponse} = require('../utils/common');

/* POST , api/v1/airplanes
req.body={modelNumber, capacity}*/ 
async function createAirplane(req,res) {
   try {
      const airplane = await AirPlaneService.createAirplane({
        modelNumber:req.body.modelNumber,
        capacity: req.body.capacity
      })
      SuccessResponse.data = airplane;
      return  res.status(StatusCodes.CREATED).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*GET , api/v1/airplanes
req.body={}*/ 
async function getAirplanes(req,res) {
   try {
      const airplane = await AirPlaneService.getAirplanes()
      SuccessResponse.data = airplane;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};
/*GET , api/v1/airplanes/:id
req.body={}*/ 
async function getAirplane(req,res) {
   try {
      const airplane = await AirPlaneService.getAirplane(req.params.id)
      SuccessResponse.data = airplane;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*DELETE , api/v1/airplanes/:id
req.body={}*/ 
async function destroyAirplane(req,res) {
   try {
      const airplane = await AirPlaneService.destroyAirplane(req.params.id)
      SuccessResponse.data = airplane;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*PATCH , api/v1/airplanes/:id
req.body={modelNumber,capacity}*/ 
async function updateAirplane(req,res) {
   try {
      const airplane = await AirPlaneService.updateAirplane(req.params.id,{
         modelNumber:req.body.modelNumber,
         capacity: req.body.capacity
       });
      SuccessResponse.data = airplane;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

module.exports = {
   createAirplane,
   getAirplanes,
   getAirplane,
   destroyAirplane,
   updateAirplane
}