const mongoose = require('mongoose');
var User = require('../models/user.js');
const secret = require('../config/secret.js');
mongoose.connect(secret.database);
var Schema = mongoose.Schema;
var CartSchema = new Schema({
  owner : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  total : {
    type : Number,
    default : 0
  },
  items : {
    type : Array
  },
  price : {
    type : Number,
    default : 0
  }
});
module.exports = mongoose.model('Cart',CartSchema);
