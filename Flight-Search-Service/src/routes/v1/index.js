const express = require("express");
const airplaneRoutes = require('./airplane-routes');
const cityRoutes = require('./city-routes');
const airportRoutes = require('./airport-routes');
const flightRoutes = require('./flight-routes');

const router = express.Router();

router.use('/airplanes',airplaneRoutes);
router.use('/airports',airportRoutes);
router.use('/cities',cityRoutes);
router.use('/flights',flightRoutes);

router.get('/info',(req,res)=>{
    res.status(200).json({
        message:'API is live in Flight Service'
    })
})

module.exports = router;