const express = require('express');
const router = express.Router();

const Product = require('../controller/Product');
const CheckAdmin = require('../middleware/CheckAdmin');
const CheckUser = require('../middleware/CheckUser');


router.post('/post-product',CheckAdmin , Product.upload, Product.postProduct);
router.get('/', Product.getAllProduct);
router.delete('/delete-product',CheckAdmin, Product.deleteAProduct);
router.get('/:idProduct', Product.getAProduct);


module.exports = router;