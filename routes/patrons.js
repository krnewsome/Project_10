express = require('express');
var router = express.Router();
const Patrons = require('../models').Patrons

/* ---------- PATRONS -----------. */

/* GET new_patron page. */
router.get('/new_patron', function(req, res, next) {
  res.render('new_patron', {patron: Patrons.build()}
  );//end of render
});//end of get new_patron page

/* POST new patron */
router.post('/new_patron', function(req, res, next) {
  Patrons.create(req.body).then(function(){
    res.redirect('all_patrons');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render('new_patron', {patron: Patrons.build(req.body), errors: err.errors});
    }else {
      throw err;
    }
  }).catch(function(err){
    console.log(err)
  });//end of catch
});//end of post

/* GET all_patrons page. */
router.get('/all_patrons', function(req, res, next) {
  Patrons.findAll()
  .then(function(patrons){
    res.render('all_patrons', {patrons: patrons});
  });//end of find all
});//end of get all_patrons page

module.exports = router;
