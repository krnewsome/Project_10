const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Book, Patrons, Loans } = require('../models');
const moment = require('moment');

/* ---------- LOANS -----------. */

/* GET all_loans page. */
router.get('/all_loans', function (req, res, next) {
  Loans.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      { model: Book },
      { model: Patrons },
    ],
  })//end of findAndCountAll
  .then(function (loans) {
    loans.rows.map(function (loan) {
      if (loan.returned_on !== null)
        loan.returned_on = moment(loan.returned_on).format('YYYY-MM-DD');
    });

    const itemCount = loans.count;
    const pageCount = Math.ceil(loans.count / 10);
    res.render('all_loans', { loans: loans.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) }
    );//end of render
  });//end of then
});//end of get

/* GET new_loan page. */
router.get('/new_loan', function (req, res, next) {
  Book.findAll().then(function (books) {
    let book = books;
    Patrons.findAll().then(function (patrons) {
      let patron = patrons;
      res.render('new_loan', { loan: Loans.build(), books: book, patrons: patron }
      );//end of render
    });//end of then
  });//end of then
});//end of get new_loan page

/* Post new_loan page. */
router.post('/new_loan', function (req, res, next) {
  Loans.create(req.body).then(function () {
    res.redirect('all_loans');
  }).catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      Book.findAll()
      .then(function (books) {
        books = books;
        Patrons.findAll()
        .then(function (patrons) {
          patrons = patrons;
          res.render('new_loan', { loan: Loans.build(req.body), books: books, patrons: patrons, errors: err.errors }
          );//end of render
        });//end of then
      });//end of then
    }else {
      throw err;
    }
  }).catch(function (err) {
    console.log(err);
  });//end of catch
});//end of post new loan

/* GET overdue_loans page. */
router.get('/overdue_loans', function (req, res, next) {
  Loans.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      { model: Book },
      { model: Patrons },
    ],
    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: new Date(),
      },
    },
  })
  .then(function (loans) {
    const itemCount = loans.count;
    const pageCount = Math.ceil(loans.count / 10);
    res.render('overdue_loans', { loans: loans.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) });
  });//end of then
});//end of get overdue_loans

/* GET checked_loans page. */
router.get('/checked_loans', function (req, res, next) {
  Loans.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      { model: Book },
      { model: Patrons },
    ],
    where: {
      returned_on: {
        [Op.eq]: null,
      },
    },
  })
  .then(function (loans) {
    const itemCount = loans.count;
    const pageCount = Math.ceil(loans.count / 10);
    res.render('checked_loans', { loans: loans.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) });
  });//end of then
});//end of get checked_loans

/* GET return_book page. */
router.get('/return_book/:id', function (req, res, next) {
  Loans.findAll({
    include: [
      { model: Book },
      { model: Patrons },
    ],
    where: {
      id: req.params.id,
    },
  })
  .then(function (loans) {
    console.log(loans[0].returned_on);
    if (loans[0].returned_on === null)
        loans[0].returned_on = moment().format('YYYY-MM-DD');
    res.render('return_book', { loans: loans });
  });//end of then
});//end of get return_book

/* POST updated loan returned_book */
router.post('/return_book/:id', function (req, res, next) {
  Loans.findAll({
    where: {
      id: req.params.id,
    },
  })//end of findAll
  .then(function (loans) {
    return Loans.update(req.body, {
      where: {
        id: req.params.id,
      },
    })//end of update
    .then(function (loans) {
      res.redirect('/all_loans');
    });//end of then
  })//end of then
  .catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      let errors = err.errors;
      Loans.findAll({
        include: [
          { model: Book },
          { model: Patrons },
        ],
        where: {
          id: req.params.id,
        },
      })//end of findall
      .then(function (loans) {
        res.render('return_book', { loans: loans, errors: errors });
      });//end of then
    }else {
      throw err;
    }
  })//end of catch
  .catch(function (err) {
    console.log(err);
  });//end of catch
});//end of update loan

module.exports = router;
