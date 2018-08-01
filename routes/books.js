var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
/* ---------- BOOKS -----------. */

/* GET new_book page. */
router.get('/new_book', function(req, res, next) {
    res.render('new_book', {book: Book.build()
  });
});


/* POST new book */
router.post('/new_book', function(req, res, next) {
  Book.create(req.body).then(function(){
    res.redirect('all_books');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render('new_book', {book: Book.build(req.body), errors: err.errors});
    }else {
      throw err;
    }
  }).catch(function(err){
    console.log(err)
  });//end of catch
});//end of post


/* GET all_books page. */
router.get('/all_books', function(req, res, next) {
  Book.findAll()
  .then(function(books){
    res.render('all_books', {books:books})
  })
  .catch(function (err) {
    res.send(500);
  });//end of catch
});

/* GET individual book_detail page. */
router.get('/book_detail/:id', function(req, res, next) {
  Book.findAll({
    where: {
      id: req.params.id
    },

  }).then(function(books){
    res.render('book_detail', {books:books});
  })
});//end of get book_detail page

/* Post update book. */
router.post('/book_detail/:id', function(req, res, next) {
  Book.findAll({
    where: {
      id: req.params.id
    }
  })//end of findAll
  .then(function(books){
      return Book.update(req.body, {
        where: {
          id: req.params.id,
        }
      })//end of update
    .then(function(book) {
        console.log(book)
        res.redirect('/all_books');
    })//end of then
  })//end of then
  .catch(function (err) {
    if(err.name === "SequelizeValidationError"){
        res.render('new_book', {book: Book.build(req.body), errors: err.errors});
    }else {
      throw err;
    }
  })//end of catch
  .catch(function(err){
    console.log(err)
    });//end of catch
});//end of update book

/* GET overdue_books page. */
router.get('/overdue_books', function(req, res, next) {
  res.render('overdue_books');
});

/* GET checked_books page. */
router.get('/books?filter=checked_out', function(req, res, next) {
  res.render('checked_books ');
});

module.exports = router;
