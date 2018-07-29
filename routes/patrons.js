express = require('express');
var router = express.Router();

/* ---------- patrons -----------. */

/* GET new_loan page. */
router.get('/new_patron', function(req, res, next) {
  res.render('new_patron');
});

/* GET all_patrons page. */
router.get('/all_patrons', function(req, res, next) {
  res.render('all_patrons');
});

module.exports = router;
