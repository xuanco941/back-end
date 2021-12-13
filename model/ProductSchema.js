const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  nameProduct: String,
  category: {type: String},
  price: {type: Number, default: 0} ,
  type : {type: Array , default:[{size: 42, amount: 0}]} ,
  image : Array,
  sale: {type: Number, default: 0},
  description: String,
  status: {type: Boolean, default: true},
  color: String
}, {
  timestamps: true,
  collection: 'Product'
});


module.exports = mongoose.model('Product', Product);