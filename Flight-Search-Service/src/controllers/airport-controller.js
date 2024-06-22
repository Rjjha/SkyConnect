const {AirportService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse,SuccessResponse} = require('../utils/common');

/* POST , api/v1/airports
req.body={name, address,code,cityId}*/ 
async function createAirport(req,res) {
   try {
      const airport = await AirportService.createAirport({
        name:req.body.name,
        address: req.body.address,
        code:req.body.code,
        cityId:req.body.cityId
      })
      SuccessResponse.data = airport;
      return  res.status(StatusCodes.CREATED).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*GET , api/v1/airports
req.body={}*/ 
async function getAirports(req,res) {
   try {
      const airport = await AirportService.getAirports()
      SuccessResponse.data = airport;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};
/*GET , api/v1/airports/:id
req.body={}*/ 
async function getAirport(req,res) {
   try {
      const airport = await AirportService.getAirport(req.params.id)
      SuccessResponse.data = airport;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*DELETE , api/v1/airports/:id
req.body={}*/ 
async function destroyAirport(req,res) {
   try {
      const airport = await AirportService.destroyAirport(req.params.id)
      SuccessResponse.data = airport;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

/*PATCH , api/v1/airports/:id
req.body={name, address,code,cityId}*/ 
async function updateAirport(req,res) {
   try {
      const airport = await AirportService.updateAirport(req.params.id,{
        name:req.body.modelname,
        address: req.body.address,
        code:req.body.code,
        cityId:req.body.cityId
       });
      SuccessResponse.data = airport;
      return  res.status(StatusCodes.OK).json(SuccessResponse);
   } catch (error) {
       ErrorResponse.error = error;
       return res.status(error.statusCode).json(ErrorResponse);
   }
};

module.exports = {
   createAirport,
   getAirports,
   getAirport,
   destroyAirport,
   updateAirport
}