const CrudRepository = require('./crud-reposiotory');
const {User} = require('../models');
const { where } = require('sequelize');

class UserRepository extends CrudRepository{
   constructor(){
    super(User);
   }
   async getUserByEmail(email){
    const user = await User.findOne({where:{email:email}});
    return user;
   }
}

module.exports = UserRepository;