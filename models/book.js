'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: {
      primaryKey: true,
      type:DataTypes.INTEGER,
      autoIncrement: true,
    },

    title:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },

    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },

    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    },

    first_published: {
      type: DataTypes.INTEGER
    }
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
    Book.hasMany(models.Loans, { foreignKey: 'book_id'})
  };
  return Book;
};
