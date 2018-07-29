express = require('express');
var router = express.Router();

/* ---------- LOANS -----------. */

/* GET new_loan page. */
router.get('/new_loan', function(req, res, next) {
  res.render('new_loan');
});

/* GET all_loans page. */
router.get('/all_loans', function(req, res, next) {
  res.render('all_loans');
});

/* GET overdue_loans page. */
router.get('/overdue_loans', function(req, res, next) {
  res.render('overdue_loans');
});

/* GET checked_loans page. */
router.get('/checked_loans', function(req, res, next) {
  res.render('checked_loans');
});

module.exports = router;
