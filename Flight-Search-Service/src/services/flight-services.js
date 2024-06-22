const {FlightRepository} = require('../repositories')
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {Op, where} = require('sequelize');
const {Airplane} = require('../models');

const flightRepository = new FlightRepository();

/* POST , api/v1/flights
req.body={flightNumber: 'UK 808',
 *  airplaneId: 'a380',
 *  departureAirportId: 12,
 *  arrivalAirportId: 11,
 *  arrivalTime: '11:10:00',
 *  departureTime: '9:10:00',
 *  price: 2000
 *  boardingGate: '12A',
 *  totalSeats: 120}*/ 

async function createFlight (data) 
{
   try {
     const airplane = await Airplane.findByPk(data.airplaneId);
     data.totalSeats = airplane.capacity;
     const flight = await flightRepository.create(data);
     return flight;
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

//GET , api/v1/flights
async function getAllFlights (query) 
{
   const customFilter={};
      let sortFilter=[];
      const endTripTime = " 23:59:00";
      //trip MUM-DEL
      if(query.trip)
         {
            [departureAirportId,arrivalAirportId] = query.trip.split('-');
            if(departureAirportId===arrivalAirportId)
               {
                  throw new AppError('departutre and arrival airport cannot be same',StatusCodes.BAD_REQUEST);
               }
            customFilter.departureAirportId=departureAirportId;
            customFilter.arrivalAirportId = arrivalAirportId;
         }
      if(query.price)
         {
            [minPrice,maxPrice] = query.price.split("-");
            customFilter.price={
               [Op.between]:[minPrice,((maxPrice==undefined) ? 30000 : maxPrice)]
            }
         }
      if(query.travellers)
         {
            customFilter.totalSeats={
               [Op.gte]:query.travellers
            }
         }
      if(query.tripDate)
         {
            customFilter.departureTime={
               [Op.between]:[query.tripDate,query.tripDate+endTripTime]
            }
         }
      if(query.sort)
         {
            const params = query.sort.split(",");
            const sortFilters = params.map((param)=>param.split('_'));
            sortFilter=sortFilters;
         }
   try {
      const flights = await flightRepository.getAllFlights(customFilter,sortFilter);
      return flights;

   } catch (error) {
      throw new AppError('Cannot fetch details of all flights',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}
async function getFlight(id) {
   try {
       const flight = await flightRepository.get(id);
       return flight;
   } catch(error) {
       if(error.statusCode == StatusCodes.NOT_FOUND) {
           throw new AppError('The flight you requested is not present', error.statusCode);
       }
       throw new AppError('Cannot fetch data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
   }
}
async function updateSeats(data) {
   try {
       const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
       return response;
   } catch(error) {
       console.log(error);
       throw new AppError('Cannot update data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

module.exports ={
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}