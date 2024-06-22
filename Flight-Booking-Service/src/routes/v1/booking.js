const express = require("express");
const {BookingController} = require('../../controllers');

const router = express.Router();
/*
POST : api/v1/bookings
req.body : {flightId,userId,noofSeats}
*/
router.post(
    '/',
    BookingController.createBooking
)

/*
POST : api/v1/bookings/payment
req.header : x-idempotency-key : jbdbfkd
req.body : {totalCost,userId,bookingId}
*/
router.post(
    '/payment',
    BookingController.makePayment
)

module.exports = router;