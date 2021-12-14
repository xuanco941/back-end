const express = require('express');
const router = express.Router();

const Product = require('../controller/Product');

router.post('/post-product' , Product.upload, Product.postProduct);
router.get('/', Product.getAllProduct);


module.exports = router;