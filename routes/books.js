const express = require('express');
const db = require('../db')
const router = express.Router();
const {Book} = db.models;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

//Redirect so that the user automatically goes to the full listing of books
router.get("/", asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

//Get full list of books
router.get("/books", asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", {books: books, title: 'My Library Application'});
  })
);

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
    res.sendStatus(404)
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
      throw error;
    }
  }
}))

router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  if (book) {
    res.redirect("/books");
  } else {
    res.sendStatus(404)
  }
}));

module.exports = router;
