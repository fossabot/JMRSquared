"use strict";
import Sequelize from 'sequelize';

class User{
  constructor(sequelize){
    this.User =  sequelize.define('user', {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      }
    });
    this.sync();
  }


  sync(){
    this.User.sync({force: true}).then(() => {
      // Table created
      return this.User.create({
        firstName: 'John',
        lastName: 'Hancock'
      });
    });  
  }
}

module.exports = User;