const CrudRepository = require('./crud-reposiotory');
const {Role} = require('../models');
const { where } = require('sequelize');

class RoleRepository extends CrudRepository{
   constructor(){
    super(Role);
   }
   async getRoleByName(name){
    const role = await Role.findOne({where:{name:name}});
    return role;
   }
}

module.exports = RoleRepository;