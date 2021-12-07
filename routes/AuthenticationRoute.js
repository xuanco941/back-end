const express = require('express');
const router = express.Router();

const Authentication = require('../controller/Authentication');

router.post('/signin' , Authentication.SignIn);

router.post('/signup' , Authentication.SignUp);


module.exports = router;