const CrudRepository = require("./crud-reposiotory");
const {City}  = require('../models');

class CityRepository extends CrudRepository{
     constructor()
     {
        super(City); //super is used for calling the constructor of the parent class
     }
}
module.exports = CityRepository;