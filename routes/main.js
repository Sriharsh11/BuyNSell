const router = require('express').Router();
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Product = require('../models/product.js');
var Cart = require('../models/cart.js');
var stripe=require('stripe')('sk_test_HL0ZuY4etpJKRhZR7pZnc08X');
const passport = require('passport');
const passportConf = require('../config/passport.js');
router.get('/edit',function(req,res,next){
  if(req.user){
    User.findOne({_id : req.user._id},function(err,user){
      if(err) return next(err);
      res.render('main/edit.ejs',{
        message : req.flash('success'),
        user : user
      });
    });
 }
 else {
   res.send('login or signup first');
 }
});
router.post('/edit',function(req,res,next){
  User.findOne({_id : req.user._id},function(err,user){
    if(err) return next(err);
    if(user){
      user.email = req.body.email;
      user.password = req.body.password;
      user.fullName = req.body.fullName;
      user.programme = req.body.programme;
      user.branch = req.body.branch;
      user.year = req.body.year;
      user.rollno = req.body.roll;
      user.phoneNo = req.body.phone;
      user.hostelNo = req.body.hostel;
      user.roomNo = req.body.room;
      user.save(function(err){
        if(err) return next(err);
        req.flash('success','Successfully edited profile');
        return res.redirect('/edit');
      });
    }
  });
});
router.get('/login',(req,res) => {
  console.log(req.user);
  if(req.user) return res.redirect('/');
  res.render('accounts/login.ejs',{
    message : req.flash('loginMessage')
  });
});
router.post('/login',passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));
router.get('/profile',(req,res,next) => {
  console.log(req.user);
  User.findOne({_id : req.user._id},(err,user) => {
    if(err) return next(err);
    res.render('accounts/profile.ejs',{user : user});
  });
});
router.get('/logout',(req,res,next) => {
  req.logout();
  res.redirect('/');
});
router.get('/',(req,res,next) => {
  Category.find({},function(err,category){
    if(err) return next(err);
    res.render('main/home.ejs',{
      category : category
    });
  });
});
router.get('/signup',(req,res) => {
  res.render('accounts/signup.ejs',{errors : req.flash('errors')});
});
router.post('/signup',(req,res) => {
  var email = req.body.email;
  var password = req.body.password;
  var fullName = req.body.fullName;
  var programme = req.body.programme;
  var branch = req.body.branch;
  var year = req.body.year;
  var roll = req.body.roll;
  var phone = req.body.phone;
  var hostel = req.body.hostel;
  var room = req.body.room;
  var error='';
  if(email==''){
    error += 'email is missing';
    req.flash('errors','email is missing');
  }
  if(password==''){
    error += 'password is missing';
    req.flash('errors','password is missing');
  }
  if(fullName==''){
    error += 'fullName is missing';
    req.flash('errors','full name  is missing');
  }
  if(programme==''){
    error = 'programme is missing';
    req.flash('errors','programme is missing');
  }
  if(branch==''){
    error = 'branch is missing';
    req.flash('errors','branch is missing');
  }
  if(year==''){
    error = 'year is missing';
    req.flash('errors','year is missing');
  }
  if(roll==''){
    error = 'roll number is missing';
    req.flash('errors','roll number is missing');
  }
  if(phone==''){
    error = 'phone number is missing';
    req.flash('errors','phone number is missing');
  }
  if(hostel==''){
    error = 'hostel number is missing';
    req.flash('errors','hostel number is missing');
  }
  if(room==''){
    error = 'room number is missing';
    req.flash('errors','room number is missing');
  }
  if(error){
    res.redirect('/signup');
  }
  // req.checkBody('email','Email is required').notEmpty();
  // req.checkBody('password','password is required').notEmpty();
  // req.checkBody('fullName','full name is required').notEmpty();
  // req.checkBody('programme','programme is required').notEmpty();
  // req.checkBody('branch','branch is required').notEmpty();
  // req.checkBody('year','year is required').notEmpty();
  // req.checkBody('roll','roll number is required').notEmpty();
  // req.checkBody('phone','phone number is required').notEmpty();
  // req.checkBody('hostel','hostel number is required').notEmpty();
  // req.checkBody('room','room number is required').notEmpty();
  // var errors = req.validationErrors();
  // if(errors){
  //   req.flash('errors',errors);
  //   res.redirect('/signup');
  // }
  else{
  User.findOne({email : email},(err,existingUser) => {
    if(err) return next(err);
    if(existingUser){
      //error = error + 'Account with that email already exists';
      req.flash('errors','Account with that email already exists');
      res.redirect('/signup');
    }
    else{
      var user = new User();
      user.email = req.body.email;
      user.password = req.body.password;
      user.fullName = req.body.fullName;
      user.programme = req.body.programme;
      user.branch = req.body.branch;
      user.year = req.body.year;
      user.rollno = req.body.roll;
      user.phoneNo = req.body.phone;
      user.hostelno = req.body.hostel;
      user.roomNo = req.body.room;
        user.save(function(err) {
          if(err) {
            console.log(err);
          }
          var cart = new Cart();
          cart.owner = user._id;
          cart.save(function(err){
            if(err) return next(err);
            //stores session in the server and cookie in the browser
            req.logIn(user,function(err) {
              if(err) {
                console.log(err);
              }
              //if(err) return next(err);
              res.redirect('/');
            });
          });
        });
      }
    });
  }
});

router.get('/payment',function(req,res,next){
    res.render('payments/index');

});

router.post('/payment',function(req,res,next){
    Cart.findOne({owner : req.user._id},function(err,cart){
      if(err) return next(err);
      var stripeToken=req.body.stripeToken;
      var currentCharges = cart.price;
      stripe.customers.create({
          source:stripeToken
      }).then(function(customer){
          return stripe.charges.create({
              amount:currentCharges,
              currency:'usd',
              customer:customer.id
          });
        });
      });
    console.log("Payment Successful");
    Cart.findOne({owner: req.user._id},function(err,cart){
      if(err) return next(err);
      for(var i=0; i< cart.items.length ; i++){
        cart.total = cart.total - 1;
        cart.price = cart.price - cart.items[i].price;
        cart.items.pull(cart.items[i]);
        //cart.save();
      }
      cart.save();
      res.redirect('/');
    });
});


module.exports = router;
