var express = require('express');
var router = express.Router();
const{book} = require('../models');
/* ---------- BOOKS -----------. */

/* GET new_book page. */
router.get('/new_book', function(req, res, next) {
  res.render('new_book', {book: book.build()});
});

/* GET all_books page. */
router.get('/all_books', function(req, res, next) {
  book.findAll()
  .then(function(books){
    res.render('all_books', {books:books})
  });
});

/* GET overdue_books page. */
router.get('/overdue_books', function(req, res, next) {
  res.render('overdue_books');
});

/* GET checked_books page. */
router.get('/books?filter=checked_out', function(req, res, next) {
  res.render('checked_books ');
});

module.exports = router;
