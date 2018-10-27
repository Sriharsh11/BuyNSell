const router = require('express').Router();
var Product = require('../models/product.js');
var Category = require('../models/category.js');
var User = require('../models/user.js');
var Cart = require('../models/cart.js');
router.get('/add-product',function(req,res,next){
  if(req.user){
  Category.find({},function(err,category){
    if(err) return next(err);
    console.log(category);
    res.render('main/add-product.ejs',{
      message : req.flash('success'),
      category : category
    });
  });
 }
 else {
   res.send('login or signup first');
 }
});
router.post('/add-product',function(req,res,next){
  //console.log(req.file);
  console.log(req.body.category._id);
  var product = new Product();
  product.category = req.body.category;
  console.log('Its Working');
  product.name = req.body.name;
  product.price = req.body.price;
  product.image = req.body.image;
  product.save(function(err){
    console.log('Its Working');
    if(err) return next(err);
    console.log('Its Working');
    Category.findOneAndUpdate({ name : req.body.category},{$push: {products: product }},function(err,existingCategory){
      if(err) return next(err);
      console.log(existingCategory);
      console.log('here it is');
      console.log(existingCategory.products);
      User.findOneAndUpdate({_id : req.user._id},{$push: {myProducts: product}},function(err,user){
        if(err) return next(err);
        return res.redirect('/product-details');
      });
    });
  });
});
// router.get('/edit-product',function(req,res,next){
//   Category.find({},function(err,category){
//     if(err) return next(err);
//     res.render('main/edit-product.ejs',{
//       message : req.flash('success'),
//       category : category
//     });
//   });
// });
// router.post('/edit-product',function(req,res,next){
//   Product.findOne({name : req.body.oldName},function(err,product){
//     //product.name = req.body.name;
//     //product.price = req.body.price;
//     //product.image = req.body.image;
//     //product.category = req.body.category;
//     if(req.body.category == product.category){
//       Category.findOne({name : product.category},function(err,existingCategory){
//         if(err) return next(err);
//         for(var i=0;i< existingCategory.products.length; i++){
//           if(existingCategory.products[i]._id == product._id){
//             existingCategory.products[i].name = req.body.name;
//             existingCategory.products[i].category = req.body.category;
//             existingCategory.products[i].price = req.body.price;
//             existingCategory.products[i].image = req.body.image;
//             category.save(function(err){
//               if(err) return next(err);
//               product.save(function(err){
//                 if(err) return next(err);
//                 User.findOne({_id : req.user._id},function(err,user){
//                   for(var j=0;j< user.myProducts.length; j++){
//                     if(user.myProducts[j]._id == product._id){
//                       user.myProducts[j].name = req.body.name;
//                       user.myProducts[j].price = req.body.price;
//                       user.myProducts[j].category = req.body.category;
//                       user.myProducts[j].image = req.body.image;
//                       user.save(function(err){
//                         if(err) return next(err);
//                         req.flash('success','Successfully edited product');
//                         res.redirect('/edit-product');
//                       });
//                     }
//                   }
//                 });
//               });
//             });
//           }
//         }
//       });
//     }
//     else{
//       Category.update({name : product.category},{$pull: {products: product}});
//         //if(err) return next(err);
//         //existingCategory.save(function(err){
//           //if(err) return next(err);
//           product.name = req.body.name;
//           product.price = req.body.price;
//           product.image = req.body.image;
//           product.category = req.body.category;
//           Category.findOneAndUpdate({name : req.body.category},{$push: {products: product}},function(err,category){
//             if(err) return next(err);
//             category.save(function(err){
//               if(err) return next(err);
//               product.save(function(err){
//                 if(err) return next(err);
//                 User.findOne({_id : req.user._id},function(err,user){
//                   for(var j=0;j< user.myProducts.length; j++){
//                     if(user.myProducts[j]._id == product._id){
//                       user.myProducts[j].name = req.body.name;
//                       user.myProducts[j].price = req.body.price;
//                       user.myProducts[j].category = req.body.category;
//                       user.myProducts[j].image = req.body.image;
//                       user.save(function(err){
//                         if(err) return next(err);
//                         req.flash('success','Successfully edited product');
//                         res.redirect('/edit-product');
//                       });
//                     }
//                   }
//                 });
//               });
//             });
//           });
//         //});
//       //});
//     }
//   //   product.save(function(err){
//   //     if(err) return next(err);
//   //
//   //   //   Category.findOneAndUpdate({name : req.body.category},{$push: {products: product}},function(err,newCategory))
//   //   //   //req.flash('success','Successfully edited product');
//   //   //   //res.redirect('/edit-product');
//   //   // });
//   // });
//   });
// });
router.get('/edit/:id',function(req,res,next){
  Product.findOne({_id : req.params.id},function(err,product){
    if(err) return next(err);
    Category.find({},function(err,category){
      if(err) return next(err);
      res.render('main/edit-product.ejs',{
        product : product,
        category : category
      });
    });
  });
});
router.post('/edit/:id',function(req,res,next){
  Product.findOne({_id : req.params.id},function(err,product){
    if(err) return next(err);
    var oldCategory = product.category;
    product.category = req.body.category;
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.save();
    User.findOne({_id : req.user._id},function(err,user){
        if(err) return next(err);
        for(var i=0; i< user.myProducts.length; i++){
          if(user.myProducts[i]._id == req.params.id){
            user.myProducts[i].category = req.body.category;
            user.myProducts[i].name = req.body.name;
            user.myProducts[i].price = req.body.price;
            user.myProducts[i].image = req.body.image;
            console.log('this is the value of user');
            console.log(user.myProducts);
            user.save();
            console.log(user.myProducts);
            Category.findOne({name : oldCategory},function(err,category){
                         if(err) return next(err);
                         console.log('here it is again');
                         console.log(category.products);
                         if(category.name == req.body.category){
                           for(var i=0; i< category.products.length; i++){
                             if(category.products[i]._id == req.params.id){
                               category.products[i].name = req.body.name;
                               category.products[i].price = req.body.price;
                               category.products[i].image = req.body.image;
                               category.save(function(err){
                                 if(err) return next(err);
                                 console.log('Here is the category body');
                                 console.log(category.products);
                                 res.redirect('/my-products');
                               });
                             }
                           }
                         }
                         else{
                           for(var i=0; i< category.products.length; i++){
                             if(category.products[i]._id == req.params.id){
                               category.products.splice(i,1);
                             }
                           }
                           Category.findOne({name : req.body.category},function(err,newCategory){
                             if(err) return next(err);
                             newCategory.products.push(product);
                             console.log('Here it is');
                             console.log(newCategory.products);
                             res.redirect('/my-products');
                           });
                         }
                       });
                     }
                   }
                 });
               });
             });
    //   if(err) return next(err);
    //   //res.redirect('/my-products');
    //   User.findOne({_id : req.user._id},function(err,user){
    //     if(err) return next(err);
    //     for(var i=0; i< user.myProducts.length; i++){
    //       if(user.myProducts[i]._id == req.params.id){
    //         user.myProducts[i].category = req.body.category;
    //         user.myProducts[i].name = req.body.name;
    //         user.myProducts[i].price = req.body.price;
    //         user.myProducts[i].image = req.body.image;
    //         user.save(function(err){
    //           if(err) return next(err);
    //           console.log('Here is the user');
    //           console.log(user.myProducts);
    //           Category.findOne({name : oldCategory},function(err,category){
    //             if(err) return next(err);
    //             console.log('here it is again');
    //             console.log(category.products);
    //             if(category.name == req.body.category){
    //               for(var i=0; i< category.products.length; i++){
    //                 if(category.products[i]._id == req.params.id){
    //                   category.products[i].name = req.body.name;
    //                   category.products[i].price = req.body.price;
    //                   category.products[i].image = req.body.image;
    //                   category.save(function(err){
    //                     if(err) return next(err);
    //                     console.log('Here is the category body');
    //                     console.log(category.products);
    //                     res.redirect('/my-products');
    //                   });
    //                 }
    //               }
    //             }
    //             else{
    //               for(var i=0; i< category.products.length; i++){
    //                 if(category.products[i]._id == req.params.id){
    //                   category.products.splice(i,1);
    //                 }
    //               }
    //               Category.findOne({name : req.body.category},function(err,newCategory){
    //                 if(err) return next(err);
    //                 newCategory.products.push(product);
    //                 console.log('Here it is');
    //                 console.log(newCategory.products);
    //                 res.redirect('/my-products');
    //               });
    //             }
    //           });
    //         });
    //       }
    //     }
    //   });
    // });
router.get('/product-details',function(req,res,next){
  if(req.user){
  Product.find({},function(err,product){
    if(err) return next(err);
    //console.log(product);
    res.render('main/product-details.ejs',{
      product : product
    });
  });
 }
 else {
   res.send('Please login or signup first');
 }
});
router.get('/my-products',function(req,res,next){
  User.findOne({_id: req.user._id},function(err,user){
    if(err) return next(err);
    res.render('main/my-products',{
      products : user.myProducts
    });
  });
});
router.get('/product/:id',function(req,res,next){
  Product.findOne({_id : req.params.id},function(err,product){
    if(err) return next(err);
    res.render('main/single-product.ejs',{
      product : product
    });
  });
});
router.get('/cart-add/:product_id',function(req,res,next){
  Cart.findOne({owner : req.user._id},function(err,cart){
    if(err) return next(err);
    //console.log(cart);
    Product.findOne({_id : req.params.product_id},function(err,product){
      if(err) return next(err);
      cart.items.push(product);
      cart.total = cart.total + 1;
      //Product.findOne({_id : req.params.product_id},function(err,product){
        //if(err) return next(err);
        cart.price = cart.price + product.price;
        console.log(cart);
        cart.save(function(err){
          if(err) return next(err);
          res.redirect('/profile');
        });
      //});
    });
  });
});
router.get('/cart-remove/:product_id',function(req,res,next){
  Cart.findOne({owner : req.user._id},function(err,cart){
    if(err) return next(err);
    Product.findOne({_id : req.params.product_id},function(err,product){
      console.log('here is the current status of product');
      console.log(product);
      cart.items.pull(product);
      console.log('this is the state of cart');
      console.log(cart);
      cart.total = cart.total - 1;
      //Product.findOne({_id : req.params.product_id},function(err,product){
        //if(err) return next(err);
        cart.price = cart.price - product.price;
        console.log(cart);
        cart.save(function(err){
          if(err) return next(err);
            res.redirect('/profile');
        });
      //});
    });
  });
});
router.get('/cart',function(req,res,next){
  Cart.findOne({owner : req.user._id},function(err,cart){
    if(err) return next(err);
    res.render('main/myCart.ejs',{
      myCart : cart
    });
  });
});
module.exports = router;
