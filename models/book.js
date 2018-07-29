'use strict';
module.exports = (sequelize, DataTypes) => {
  var book = sequelize.define('book', {
    id: {
      primaryKey: true,
      type:DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {});
  book.associate = function(models) {
    // associations can be defined here
  };
  return book;
};
