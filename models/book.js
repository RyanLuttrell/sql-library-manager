'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
        Book.init({
            title: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: {
                        msg: "Sorry, but we need a title for the book"
                }
            },
            author: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: {
                        msg: "Sorry, but we need an author for the book"
                    }
                }
            },
            genre: {
                type: Sequelize.STRING
            },
            year: {
                type: Sequelize.INTEGER
            }
        }
    }, {sequelize})

    return Book;
}