express = require('express');
var router = express.Router();
const {Loans, Book, Patrons }= require('../models');
const moment = require('moment');

/* ---------- LOANS -----------. */

/* GET new_loan page. */
router.get('/new_loan', function(req, res, next) {
    Book.findAll().then(function(books){
      books = books
      Patrons.findAll().then(function(patrons){
        patrons = patrons
        res.render('new_loan', {loan:Loans.build()
        , books:books, patrons:patrons}
      )//end of render
      })
    })
});//end of get new_loan page


/* Post new_loan page. */
router.post('/new_loan', function(req, res, next){
  Loans.create(req.body).then(function(){
    res.redirect('all_loans')
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      Book.findAll().then(function(books){
        books = books
        Patrons.findAll().then(function(patrons){
          patrons = patrons
          res.render('new_loan', {loan:Loans.build(req.body)
          , books:books, patrons:patrons, errors: err.errors}
        )//end of render
        })
      })
    }else {
      throw err;
    }
  }).catch(function(err){
    console.log(err)
  });//end of catch
});//end of post new loan


/* GET all_loans page. */
router.get('/all_loans', function(req, res, next) {
  Loans.findAll({
    include: [
      {model: Book},
      {model: Patrons}
    ],
  }).then(function(loans){
    loans.map(function(loan){
      if(loan.returned_on !== null)
      loan.returned_on = moment(loan.returned_on).format('YYYY-MM-DD')
    });
    res.render('all_loans', {loans:loans});
  })//end of then
});//end of get

/* GET overdue_loans page. */
router.get('/overdue_loans', function(req, res, next) {
  res.render('overdue_loans');
});

/* GET checked_loans page. */
router.get('/checked_loans', function(req, res, next) {
  res.render('checked_loans');
});

/* GET return_book page. */
router.get('/return_book/:id', function(req, res, next) {
  Loans.findAll({
    include: [
      {model: Book},
      {model: Patrons}
    ],
    where: {
      id: req.params.id,
    }
  }).then(function(loans){
    loans[0].returned_on = moment().format('YYYY-MM-DD')
    res.render('return_book', {loans: loans});
  })
});

/* POST updated loan returned_book */
router.post('/return_book/:id', function(req, res, next) {
  Loans.findAll({
    where: {
      id: req.params.id
    }
  })//end of findAll
  .then(function(loan){
      return Loans.update(req.body, {
        where: {
          id: req.params.id,
        },
      })//end of update
    .then(function(loan) {
        res.redirect('/all_loans');
    })//end of then
  })//end of then
  .catch(function (err) {
    if(err.name === "SequelizeValidationError"){
        res.render('new_book', {
          loan: Loan.build(req.body),errors: err.errors});
    }else {
      throw err;
    }
  })//end of catch
  .catch(function(err){
    console.log(err)
    });//end of catch
});//end of update book



module.exports = router;
