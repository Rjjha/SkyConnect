const express = require("express");
const bookingRoutes = require('./booking');
const router = express.Router();
const {BookingController} = require('../../controllers');

router.use('/bookings',bookingRoutes);

router.get('/info',(req,res)=>{
    res.status(200).json({
        message:'API is live in Booking Service'
    })
})

module.exports = router;
