const CrudRepository = require("./crud-reposiotory");
const { Airplane}  = require('../models');

class AirplaneRepository extends CrudRepository{
     constructor()
     {
        super(Airplane); //super is used for calling the constructor of the parent class
     }
}
module.exports = AirplaneRepository;