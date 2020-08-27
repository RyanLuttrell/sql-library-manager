const { Sequelize } = require("sequelize");


module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
          type: Sequelize.STRING,
          validate: {
              notEmpty: {
                  msg: "Sorry, but we need a title for the book"
              }
          },
      },
      author: {
          type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Sorry, but we need an author for the book"
              }
            }
      },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
      }, {sequelize,}
    );

  return Book;
};