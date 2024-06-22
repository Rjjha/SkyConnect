const express = require("express");
const {AirportController} =require('../../controllers');
const {AirportMiddleware} = require('../../middlewares');

const router = express.Router();

/* POST , api/v1/airports
req.body={name, address,code,cityId}*/ 
router.post('/',
    AirportMiddleware.validataRequest,
    AirportController.createAirport
);

/*GET , api/v1/airports
req.body={}*/ 
router.get('/',
   AirportController.getAirports
)

/*GET , api/v1/airports/:id
req.body={}*/ 
router.get('/:id',
    AirportController.getAirport
);

/*DELETE , api/v1/airports/:id
req.body={}*/ 
router.delete('/:id',
    AirportController.destroyAirport
);

/*PATCH , api/v1/airports/:id
req.body={name, address,code,cityId}*/ 
router.patch('/:id',
    AirportController.updateAirport
);

module.exports = router;