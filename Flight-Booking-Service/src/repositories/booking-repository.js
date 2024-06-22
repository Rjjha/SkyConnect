const {Booking } = require('../models');
const CrudRepository = require('./crud-reposiotory');
const {StatusCodes} = require('http-status-codes');
const {Op} = require('sequelize');
const {Enums} = require('../utils/common');
const {CANCELLED,BOOKED} = Enums.BOOKING_STATUS;
const AppError = require('../utils/errors/app-error');

class BookingRepository extends CrudRepository{
     constructor(){
        super(Booking);
     }
     async createBooking(data,transaction){
        const response = await Booking.create(data,{transaction:transaction});
        return response;
     }
     async get(data,transaction){
        const response = await Booking.findByPk(data,{transaction:transaction});
        if(!response)
         {
           throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
         }
         return response;
     }
     async update(id, data, transaction) { // data -> {col: value, ....}
        const response = await Booking.update(data, {
            where: {
                id: id
            }
        }, {transaction: transaction});
        return response;
    }
    async cancelOldBookings(timestamp){
       await Booking.update({status:CANCELLED},{
         where:{
            [Op.and]:[
               {
                  createdAt:{
                     [Op.lt]:timestamp
                  }
               },
               {
                  status:{
                     [Op.ne]:BOOKED
                  }
               },
               {
                  status:{
                     [Op.ne]:CANCELLED
                  }
               }
            ]
         }
       })
    }

    async getAllBookings(userId) {
      const response = await this.model.findAll({
        where: {
          userId: userId,
        },
      });
      if (!response) {
        throw new AppError(
          "Not able to find the bookings ",
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    }
}
module.exports = BookingRepository;