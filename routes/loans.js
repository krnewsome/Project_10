express = require('express');
var router = express.Router();
const Loans = require('../models').Loans;
const Book = require('../models').Book;
const Patrons = require('../models').Patrons;

/* ---------- LOANS -----------. */

/* GET new_loan page. */
router.get('/new_loan', function(req, res, next) {
    Book.findAll().then(function(books){
      books = books
      Patrons.findAll().then(function(patrons){
        patrons = patrons
      })
      res.render('new_loan', {loan:Loans.build()
      , books:books}
    )//end of render
    })
});//end of get

/* GET all_loans page. */
router.get('/all_loans', function(req, res, next) {
  Loans.findAll().then(function(loans){
    loans = loans
    console.log(loans)
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

module.exports = router;
