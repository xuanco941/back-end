const express = require('express');
const router = express.Router();

const Product = require('../controller/Product');

router.post('/post-product' , Product.postProduct);


module.exports = router;