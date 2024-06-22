const express = require("express");
const {FlightController} =require('../../controllers');
const {FlightMiddleware} = require('../../middlewares');

const router = express.Router();

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
router.post('/',
    FlightMiddleware.validataRequest,
    FlightController.createFlight
);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
    FlightController.getAllFLights
)

// /api/v1/flights/:id GET
router.get('/:id', 
    FlightController.getFlight);

// /api/v1/flights/:id/seats PATCH
router.patch(
    '/:id/seats', 
    FlightMiddleware.validateUpdateSeatsRequest,
    FlightController.updateSeats
);

module.exports = router;