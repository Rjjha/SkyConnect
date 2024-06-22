'use strict';
const {Enums} = require('../utils/common');
const {BUSINESS,PREMIUM_ECONOMY,ECONOMY,FIRST_CLASS} = Enums.SEAT_TYPE;

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Airplane,{
        foreignKey:'airplaneId'
      })
    }
  }
  Seat.init({
    airplaneId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    row:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    col:{
      type:DataTypes.STRING,
      allowNull:false
    },
    type:{ 
      type:DataTypes.ENUM,
      values: [BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS],
      allowNull:false,
      defaultValue:ECONOMY
    }
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};