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

/* GET library listing. */
router.get("/", asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

//GET books listing
router.get("/books", asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", {books: books});
  })
);

module.exports = router;
