const mongoose = require('mongoose');
const secret = require('../config/secret.js');
const mongoosastic = require('mongoosastic');
mongoose.connect(secret.database);
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
  category : {
    type : String,
    ref : 'Category'
  },
  name : {
    type : String,
    required : true,
    trim : true
  },
  price : {
    type : Number,
    required : true,
    trim : true
  },
  image : {
    type : String,
    required : true
  }
});
ProductSchema.plugin(mongoosastic,{
  hosts : [
    'localhost:9200'
  ]
});
module.exports = mongoose.model('Product',ProductSchema);
