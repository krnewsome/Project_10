'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patrons = sequelize.define('Patrons', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },

    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name is required',
        },
      },
    },//end of first_name

    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name is required',
        },
      },
    },//end of last_name

    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required',
        },
      },
    },//end of address

    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email is required',
        },
      },
    },//end of email

    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library ID is required',
        },
      },
    },//end of library_id

    zip_code: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Zip code is required',
        },
      },
    },
  }, {});
  Patrons.associate = function (models) {
    // associations can be defined here
    Patrons.hasMany(models.Loans, { foreignKey: 'patrons_id' });
  };

  return Patrons;
};
