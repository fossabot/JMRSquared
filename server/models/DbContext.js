"use strict";
import Sequelize from 'sequelize';

class DBContext{
    constructor(sequelize){
        this.sequelize = sequelize;
    }

}

module.exports = DBContext;