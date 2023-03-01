/**
 * task.js
 * @description :: sequelize model of database table task
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Task = sequelize.define('task',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  title:{ type:DataTypes.STRING },
  description:{ type:DataTypes.TEXT },
  isCompleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  isDeleted:{ type:DataTypes.BOOLEAN },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  addedBy:{ type:DataTypes.INTEGER },
  updatedBy:{ type:DataTypes.INTEGER }
}
,{
  hooks:{
    beforeCreate: [
      async function (task,options){
        task.isActive = true;
        task.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (task,options){
        if (task !== undefined && task.length) { 
          for (let index = 0; index < task.length; index++) { 
        
            const element = task[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Task.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Task);
sequelizePaginate.paginate(Task);
module.exports = Task;
