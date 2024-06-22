const CrudRepository = require("./crud-reposiotory");
const { Airport}  = require('../models');

class AirportRepository extends CrudRepository{
     constructor()
     {
        super(Airport); //super is used for calling the constructor of the parent class
     }
}
module.exports = AirportRepository;