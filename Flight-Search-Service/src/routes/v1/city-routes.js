const express = require("express");
const {CityController} =require('../../controllers');
const {CityMiddleware} = require('../../middlewares');

const router = express.Router();

/* POST , api/v1/cities
req.body={name}*/ 
router.post('/',
    CityMiddleware.validataRequest,
    CityController.createCity
);

/*GET , api/v1/cities
req.body={}*/ 
router.get('/',
   CityController.getCities
)

/*GET , api/v1/cities/:id
req.body={}*/ 
router.get('/:id',
    CityController.getCity
);

/*DELETE , api/v1/cities/:id
req.body={}*/ 
router.delete('/:id',
    CityController.destroyCity
);

/*PATCH , api/v1/cities/:id
req.body={name}*/ 
router.patch('/:id',
    CityController.updateCity
);

module.exports = router;