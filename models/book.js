'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {

    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },//end of id

    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required',
        },
      },
    },//end of title

    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author is required',
        },
      },
    },//end of author

    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre is required',
        },
      },
    },//end of genre

    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Date is required',
        },
      },
    },
  }, {});

  Book.associate = function (models) {
    // associations can be defined here
    Book.hasMany(models.Loans, { foreignKey: 'book_id' });
  };

  return Book;
};
