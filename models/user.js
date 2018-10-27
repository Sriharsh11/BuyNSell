const mongoose = require('mongoose');
const secret = require('../config/secret.js');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
mongoose.connect(secret.database);
var db = mongoose.connection ;
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    trim : true
  },
  password : {
    type : String,
    required : true,
    trim : true
  },
  fullName : {
    type : String,
    required : true,
    trim : true
  },
  programme : {
    type : String,
    required : true,
    trim : true
  },
  branch : {
    type : String,
    required : true,
    trim : true
  },
  year : {
    type : Number,
    required : true,
    trim : true
  },
  rollno : {
    type : String,
    required : true,
    trim : true
  },
  phoneNo : {
    type : Number,
    required : true,
    trim : true
  },
  hostelno : {
    type : Number,
    required : true,
    trim : true
  },
  roomNo : {
    type : Number,
    required : true,
    trim : true
  },
  myProducts : {
    type : Array
  }
});
//hash the password before saving it to the database
UserSchema.pre('save',function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err,salt) => {
    if(err) return next(err);
    bcrypt.hash(user.password, salt, null, (err,hash) => {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});
//compare passswords in the database and the one that the user types in
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User',UserSchema);
