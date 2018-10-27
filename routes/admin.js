const router = require('express').Router();
var Category = require('../models/category.js');
router.get('/add-category',function(req,res,next){
  res.render('admin/add-category.ejs',{
    message : req.flash('success')
  });
});
router.post('/add-category',function(req,res,next){
  var category = new Category({
    name : req.body.name
  });
  category.save(function(err) {
    if(err) return next(err);
    req.flash('success','Successfully added new category');
    res.redirect('/add-category');
  });
});
module.exports = router;
