express = require('express');
var router = express.Router();
const { Patrons, Loans, Book } = require('../models');

/* ---------- PATRONS -----------. */

/* GET all_patrons page. */
router.get('/all_patrons', function (req, res, next) {
  Patrons.findAll()
  .then(function (patrons) {
    res.render('all_patrons', { patrons: patrons });
  });//end of then
});//end of get all_patrons page

/* GET new_patron page. */
router.get('/new_patron', function (req, res, next) {
  res.render('new_patron', { patron: Patrons.build() }
  );//end of render
});//end of get new_patron page

/* POST new patron */
router.post('/new_patron', function (req, res, next) {
  Patrons.create(req.body).then(function () {
    res.redirect('all_patrons');
  })
  .catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('new_patron', { patron: Patrons.build(req.body), errors: err.errors });
    }else {
      throw err;
    }
  })//end of catch
  .catch(function (err) {
    console.log(err);
  });//end of catch
});//end of post

/* GET patron_detail page. */
router.get('/patron_detail/:id', function (req, res, next) {
  Patrons.findAll({
    include: [
      {
        model: Loans,
        include: [Book, Patrons],
      },
    ],
    where: {
      id: req.params.id,
    },
  })//end of findAll
  .then(function (patrons) {
    res.render('patron_detail', { patrons: patrons });
  });//end of then
});//end of get patron_detail page

/* Post update patron. */
router.post('/patron_detail/:id', function (req, res, next) {
  Patrons.findAll({
    where: {
      id: req.params.id,
    },
  })//end of findAll
  .then(function (patrons) {
    return Patrons.update(req.body, {
      where: {
        id: req.params.id,
      },
    })//end of update
    .then(function (patrons) {
        res.redirect('/all_patrons');
      });//end of then
  })//end of then
  .catch(function (err) {
    if (err.name === 'SequelizeValidationError') {
      console.log(err);
      res.render('new_patron', { patron: Patrons.build(req.body), errors: err.errors });
    }else {
      throw err;
    }
  })//end of catch
  .catch(function (err) {
    console.log(err);
  });//end of catch
});//end of update book

module.exports = router;
