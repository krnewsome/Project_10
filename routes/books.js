var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const {Book, Patrons, Loans} = require('../models');
const moment = require('moment');

/* ---------- BOOKS -----------. */

/* GET new_book page. */
router.get('/new_book', function(req, res, next) {
    res.render('new_book', {book: Book.build()}
  );//end of render
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
    books.map(function(book){
      if(book.first_published !== null)
      book.first_published = moment(book.first_published).format('YYYY')
    })
    res.render('all_books', {books:books})
  })
  .catch(function (err) {
    res.send(500);
  });//end of catch
});

/* GET individual book_detail page. */
router.get('/book_detail/:id', function(req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loans,
        include: [Patrons, Book]
      }
    ],
    where: {
      id: req.params.id,
    }
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
  Loans.findAll({
    include:[{
      model: Book,
    }],
    where:{
      returned_on: null,
      return_by: {
        [Op.lt]: new Date()
      }
    }
  }).then(function(loans){
        res.render('overdue_books', {loans: loans});
      })//end of then
});//end of get overdue_books

/* GET checked_books page. */
router.get('/checked_books', function(req, res, next) {
  Loans.findAll({
    include:[{
      model: Book,
    }],
    where:{
      returned_on: {
        [Op.eq]: null,
      }
    }
  }).then(function(books){
      let checkedOutBooks = [];
    books.map(function(book){
      if(book.returned_on === null){
        book.Book.first_published = moment(book.Book.first_published).format('YYYY')
        checkedOutBooks.push(book);
      }
    })//end of map
    res.render('checked_books', {books:checkedOutBooks});
})//end of then
});//end of get cheked_books page

module.exports = router;
