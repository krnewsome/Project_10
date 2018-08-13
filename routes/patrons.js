express = require('express');
var router = express.Router();
const paginate = require('express-paginate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Patrons, Loans, Book } = require('../models');

/* ---------- PATRONS -----------. */

/* GET all_patrons page. */
router.get('/all_patrons', function (req, res, next) {
  url = req.url;
  Patrons.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  })//end of findAndCountAll
  .then(function (patrons) {
    const itemCount = patrons.count;
    const pageCount = Math.ceil(patrons.count / 10);
    res.render('all_patrons', { patrons: patrons.rows, url: url, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) });
  });//end of then
});//end of get all_patrons page

/* POST search patrons */
router.post('/all_patrons', function (req, res, next) {
  Patrons.findAndCountAll({
    where: {
      [Op.or]: [
      {
        first_name: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      {
        last_name: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      {
        address: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      {
        library_id: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      {
        zip_code: {
          [Op.like]: `%${req.body.search}%`,
        },
      },
      ],
    },
    limit: req.query.limit,
    offset: req.skip,
  })//end of findAndCountAll
  .then(function (patrons) {
    const itemCount = patrons.count;
    const pageCount = Math.ceil(patrons.count / 10);
    console.log(itemCount, pageCount);
    res.render('all_patrons', { patrons: patrons.rows, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) }
    );//end of render
  })//end of then
  .catch(function (err) {
    res.send(500);
  });//end of catch
});//end of post search page

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
    where: {
      id: req.params.id,
    },
  })//end of findAll
  .then(function (patrons) {
    let patron = patrons;
    Loans.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        { model: Book },
        { model: Patrons },
      ],
    })//end of findAndCountAll
    .then(function (loans) {
      let loan = loans.rows;
      const itemCount = loans.count;
      const pageCount = Math.ceil(loans.count / 10);
      res.render('patron_detail', { patrons: patrons, loans: loan, itemCount, pageCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) }
      );//end of render
    });//end of then
  });//end of the
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
