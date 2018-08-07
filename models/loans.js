'use strict';

const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    id: {
      primaryKey: true,
      type:DataTypes.INTEGER,
      autoIncrement: true
    },

    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Book id is required"
        }
      }
    },

    patron_id: {
      type: DataTypes.INTEGER,
       validate: {
         notEmpty: {
           msg: "Patron id is required"
         }
       }
     },

    loaned_on: {
      type: DataTypes.DATE,
      get: function(){
        return moment.utc(this.getDataValue('loaned_on')).format('YYYY-MM-DD')
      },
      validate: {
        notEmpty: {
          msg: "Loan date is required"
        }
      }
    },

    return_by: {
      type: DataTypes.DATE,
      get: function(){
        return moment.utc(this.getDataValue('loaned_on')).add(7, 'day').format('YYYY-MM-DD')
      },
      validate: {
        notEmpty: {
          msg: "Return by Date is required"
        }
      }
    },
    
    returned_on: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Return by Date is required"
        }
      }
    },
  }, {});
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.Book, {foreignKey: 'book_id'})
    Loans.belongsTo(models.Patrons, {foreignKey: 'patrons_id'})

  };
  return Loans;
};
