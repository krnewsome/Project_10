'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patrons = sequelize.define('Patrons', {
    id: {
      primaryKey: true,
      type:DataTypes.INTEGER,
      autoIncrement: true
    },

    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First name is required"
        }
      }
    },

    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last name is required"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Address is required"
        }
      }
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Library ID is required"
        }
      }
    },

    zip_code: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Zip code is required"
        }
      }
    }
  }, {});
  Patrons.associate = function(models) {
    // associations can be defined here
    Patrons.hasMany(models.Loans, {foreignKey: 'patrons_id'})
  };
  return Patrons;
};
