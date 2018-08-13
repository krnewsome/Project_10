const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Book, Patrons, Loans } = require('../models');
const moment = require('moment');

/* ---------- BOOKS ----------- */

  /* GET all_books page. */
  router.get('/all_books', function (req, res, next) {
    Book.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
    })//end of findAndCountAll
    .then(function (books) {
      books.rows.map(function (book) {
        if (book.first_published !== null)
        book.first_published = moment(book.first_published).format('YYYY');
      })
      const itemCount = books.count;
      const pageCount = Math.ceil(books.count / 10);
      res.render('all_books', { books: books.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCountreq.query.page)}
      );//end of render
    })//end of then
    .catch(function (err) {
      res.send(500);
    });//end of catch
  });//end of get all books page

/* GET new_book page. */
router.get('/new_book', function (req, res, next) {
    res.render('new_book', { book: Book.build() }
  );//end of render
  });

/* POST new book */
router.post('/new_book', function (req, res, next) {
  Book.create(req.body)
  .then(function () {
    res.redirect('all_books');
  })//end of then
  .catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('new_book', { book: Book.build(req.body), errors: err.errors });
    }else {
      throw err;
    }
  })//end of catch
  .catch(function (err) {
    console.log(err);
  });//end of catch
});//end of post

/* GET overdue_books page. */
router.get('/overdue_books', function (req, res, next) {
  Loans.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: Book,
      },
    ],

    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: new Date(),
      },
    },
  }).then(function (loans) {
    const itemCount = loans.count;
    const pageCount = Math.ceil(loans.count / 10)
    res.render('overdue_books', { loans: loans.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCountreq.query.page)});
      });//end of then
});//end of get overdue_books

/* GET checked_books page. */
router.get('/checked_books', function (req, res, next) {
  Loans.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: Book,
      },
    ],
    where: {
      returned_on: {
        [Op.eq]: null,
      },
    },
  }).then(function (loans) {
    console.log(loans.rows)
      loans.rows.map(function (loan) {
        loan.Book.first_published = moment(loan.Book.first_published).format('YYYY');
      });//end of map
      const itemCount = loans.count;
      const pageCount = Math.ceil(loans.count / 10)

      res.render('checked_books', { loans: loans.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)});
    });//end of then
});//end of get cheked_books page

/* GET individual book_detail page. */
router.get('/book_detail/:id', function (req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loans,
        include: [Patrons, Book],
      },
    ],
    where: {
      id: req.params.id,
    },
  }).then(function (books) {
    res.render('book_detail', { books: books });
  });
});//end of get book_detail page

/* Post update book. */
router.post('/book_detail/:id', function (req, res, next) {
  Book.findAll({
    where: {
      id: req.params.id,
    },
  })//end of findAll
  .then(function (books) {
      return Book.update(req.body, {
        where: {
          id: req.params.id,
        },
      })//end of update
    .then(function (book) {
        res.redirect('/all_books');
      });//end of then
    })//end of then
  .catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('new_book', { book: Book.build(req.body), errors: err.errors });
    }else {
      throw err;
    }
  })//end of catch
  .catch(function (err) {
      console.log(err);
    });//end of catch
});//end of update book

module.exports = router;
