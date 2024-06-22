const express = require("express");
const {AirplaneController} =require('../../controllers');
const {AirplaneMiddleware} = require('../../middlewares');

const router = express.Router();

/* POST , api/v1/airplanes
req.body={modelNumber, capacity}*/ 
router.post('/',
    AirplaneMiddleware.validataRequest,
    AirplaneController.createAirplane
);

/*GET , api/v1/airplanes
req.body={}*/ 
router.get('/',
   AirplaneController.getAirplanes
)

/*GET , api/v1/airplanes/:id
req.body={}*/ 
router.get('/:id',
    AirplaneController.getAirplane
);

/*DELETE , api/v1/airplanes/:id
req.body={}*/ 
router.delete('/:id',
    AirplaneController.destroyAirplane
);

/*PATCH , api/v1/airplanes/:id
req.body={modelNumber,capacity}*/ 
router.patch('/:id',
    AirplaneController.updateAirplane
);

module.exports = router;