const CrudRepository = require("./crud-reposiotory");
const {Flight,Airplane,City,Airport}  = require('../models');
const { where,Sequelize } = require("sequelize");
const db = require('../models');
const {addRowLockOnFlights} = require('./queries')

class FlightRepository extends CrudRepository{
     constructor()
     {
        super(Flight); //super is used for calling the constructor of the parent class
     }
     async getAllFlights(filter,sort){
       const response = await Flight.findAll({
            where:filter,
            order:sort,
            include:[
               {
                  model:Airplane,
                  required:true,
                  as:'airplaneDetail'
               },
               {
                  model:Airport,
                  required:true,
                  as:'departureAirport',
                  on:{
                    col1:Sequelize.where(Sequelize.col('Flight.departureAirportId'),'=',Sequelize.col('departureAirport.code'))
                  },include:{
                    model : City,
                    required:true
                  }
               },
               {
                    model:Airport,
                    required:true,
                    as:'arrivalAirport',
                    on:{
                      col1:Sequelize.where(Sequelize.col('Flight.arrivalAirportId'),'=',Sequelize.col('arrivalAirport.code'))
                    },
                    include:{
                         model : City,
                         required:true
                    }
               }
            ]
       });
       return response;
     }
     async updateRemainingSeats(flightId,seats,dec)
     {
      const transaction  = await db.sequelize.transaction();
      try {
        await db.sequelize.query(addRowLockOnFlights(flightId));
        const flight = await Flight.findByPk(flightId);
        if(dec==='true')
          {
            flight.decrement('totalSeats',{by:seats},{transaction:transaction});
          }
        else{
            flight.increment('totalSeats',{by:seats},{transaction:transaction});
          }
         await  transaction.commit();
         return flight;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
     }
}
module.exports = FlightRepository;