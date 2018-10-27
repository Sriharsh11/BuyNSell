const router = require('express').Router();
var Product = require('../models/product.js');
var Category = require('../models/category.js');
var User = require('../models/user.js');
// router.get('/about',(req,res) => {
//   Category.find({},function(err,category){
//     if(err) return next(err);
//     res.render('main/about.ejs',{
//       category : category
//     });
//   });
// });
// router.get('/products/:name',function(req,res,next){
//   Category.find({name : req.params.name},function(err,category){
//     if(err) return next(err);
//     res.render('categories/'+category.name+'.ejs',{
//       category : category
//     });
//   });
// });
// function paginate1(req, res, next) {
//
//   var perPage = 9;
//   var page = req.params.page;
//
//   Product
//     .find()
//     .skip( perPage * page)
//     .limit( perPage )
//     .exec(function(err, products) {
//       if (err) return next(err);
//       Product.count().exec(function(err, count) {
//         if (err) return next(err);
//         res.render('categories/books', {
//           products: products,
//           pages: count / perPage
//         });
//       });
//     });
//
// }
// function paginate2(req, res, next) {
//
//   var perPage = 9;
//   var page = req.params.page;
//
//   Product
//     .find()
//     .skip( perPage * page)
//     .limit( perPage )
//     .exec(function(err, products) {
//       if (err) return next(err);
//       Product.count().exec(function(err, count) {
//         if (err) return next(err);
//         res.render('categories/electronics', {
//           products: products,
//           pages: count / perPage
//         });
//       });
//     });
//
// }

// Product.createMapping(function(err, mapping) {
//   if (err) {
//     console.log("error creating mapping");
//     console.log(err);
//   } else {
//     console.log("Mapping created");
//     console.log(mapping);
//   }
// });
//   var stream = Product.synchronize();
//   var count = 0;
//
//   stream.on('data', function() {
//     count++;
//   });
//
//   stream.on('close', function() {
//     console.log("Indexed " + count + " documents");
//   });
//
//   stream.on('error', function(err) {
//     console.log(err);
//   });
//
//
//   router.post('/search', function(req, res, next) {
//     res.redirect('/search?q=' + req.body.q);
//   });
//   router.get('/search', function(req, res, next) {
//     if (req.query.q) {
//       Product.search({
//         query_string: { query: req.query.q}
//       }, function(err, results) {
//         results:
//         if (err) return next(err);
//         var data = results.hits.hits.map(function(hit) {
//           return hit;
//         });
//         res.render('main/search-result', {
//           query: req.query.q,
//           data: data
//         });
//       });
//     }
//   });

// router.get('/products/books',function(req,res,next){
//   Category.findOne({name : 'books'},function(err,category){
//       if(err) return next(err);
//       console.log(category);
//       console.log(category.products);
//       res.render('categories/books.ejs',{
//         category : category
//       });
//     });
//   });
//   router.get('/products/Electronics',function(req,res,next){
//     Category.findOne({name : 'Electronics'},function(err,category){
//         if(err) return next(err);
//         res.render('categories/electronics.ejs',{
//           category : category
//         });
//       });
//     });
router.get('/products/:id',function(req,res,next){
  User.findOne({_id : req.user._id},function(err,user){
    if(err) return next(err);
    Category.findOne({_id : req.params.id},function(err,category){
      if(err) return next(err);
      res.render('main/products.ejs',{
        category : category,
        products : category.products,
        existingUser : user
      });
    });
  });
});
router.get('/search-results/:id',function(req,res,next){
  res.render('main/search-result.ejs');
});
router.post('/search-results/:id',function(req,res,next){
  Category.findOne({_id : req.params.id},function(err,category){
    if(err) return next(err);
    if(category){
        var c = 0;
        var results = [];
        for(var i=0; i< category.products.length; i++){
            if(category.products[i].name.includes(req.body.word)){
                c++;
                results.push(category.products[i]);
            }
          }
          res.render('main/search-result.ejs',{
            count : c,
            results : results
          });
        }
      });
    });
module.exports = router;
