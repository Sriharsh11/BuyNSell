const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
//Serialize and deserialize User
passport.serializeUser((user,done) => {
  done(null,user._id);
});
passport.deserializeUser((id,done) => {
  User.findById(id,(err,user) => {
    done(err,user);
  });
});
//middleware
passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, (req,email,password,done) => {
  User.findOne({email : email},(err,user) => {
    if(err) return done(err);

    if(!user){
      return done(null, false, req.flash('loginMessage','No user has been found'));
    }
    if(!user.comparePassword(password)){
      return done(null, false, req.flash('loginMessage','Oops! Wrong Password'));
    }
    return done(null,user);
  });
}));
//custom function to validate
exports.isAuthenticated = (req,res,next) => {
  if(req.isAuthenticated()){
    next();
  }
  res.redirect('/login');
};
