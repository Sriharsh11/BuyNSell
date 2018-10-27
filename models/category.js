const mongoose = require('mongoose');
const secret = require('../config/secret.js');
var Schema = mongoose.Schema;
mongoose.connect(secret.database);
var CategorySchema = new Schema({
  name : {
    type : String,
    required : true,
    trim : true
  },
  products : {
    type : Array
  }
});
module.exports = mongoose.model('Category',CategorySchema);
