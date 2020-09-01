//Import the dependencies needed for this project
const express = require('express');
const {Op} = require('sequelize');
const db = require('../db')
const router = express.Router();
const {Book} = db.models;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(err){
      err = new Error()
      err.status = 500;
      err.message = "Oh No! The book you are looking for does not exist"
      next(err)
    }
  }
}

//Redirect so that the user automatically goes to the full listing of books
router.get("/", asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

router.get('/books', asyncHandler(async (req, res) => {
  let pageNumber = [];
  const count = await Book.count();
  const pageCount = Math.ceil(count/10);
  for (let i = 1; i <= pageCount; i++) {
    pageNumber.push(i)
  }
  const books = await Book.findAll({
    limit: 10,
    offset: 0
  });
  res.render("index", {books: books, title: 'My Library Application', pageNumber: pageNumber});
})
);

//Get full list of books
router.get("/books/page/:page", asyncHandler(async (req, res) => {
    let pageNumber = [];
    const count = await Book.count();
    const pageCount = Math.ceil(count/10);
    const pageLimit = 10;
    const currentOffset = (req.params.page - 1) * 10
    for (let i = 1; i <= pageCount; i++) {
      pageNumber.push(i)
    }
    const books = await Book.findAll({
      limit: pageLimit,
      offset: currentOffset
    });
    res.render("index", {books: books, title: 'My Library Application', pageNumber: pageNumber});
  })
);

//Search functionality for EXCEEDS EXPECTATIONS
router.post('/books/search', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {title: {
          [Op.like]: '%' + req.body.search + '%'
        }},
        {author: {
          [Op.like]: '%' + req.body.search + '%'
        }},
        {genre: {
          [Op.like]: '%' + req.body.search + '%'
        }},
        {year: req.body.search}
      ]
    }
  })
  res.render('index', {books: books, title: 'Search Resutls for: ' + req.body.search, searchBook: req.body.search})
}))

//Render the form so that a user can add a new book to the library
router.get("/books/new", asyncHandler(async (req, res) => {
  res.render("new-book", {book: {}, title: "Create A New Book"})
}));



//Post the new book to the database
router.post('/books/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: 'New Book'})
    } else {
      next(err)
    }
  }
}));

//Shows the form that has the details of the book as well as the ability to update the information in the database
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', {book: book, title: book.title})
  } else {
    next(err)
  }
}));

//Post the updates from the form to the database to allow the user to update the details of a book
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/' + book.id)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {;
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body)
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors} )
    } else {
      next(err)
    }
  }
}))

//Sends the information to the database to delete the selected row
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  if (book) {
    res.redirect("/books");
  } else {
    next(err)
  }
}));

module.exports = router;
