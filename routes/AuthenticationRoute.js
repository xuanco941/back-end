const express = require('express');
const router = express.Router();

const Authentication = require('../controller/Authentication');

router.post('/signin' , Authentication.SignIn);

router.post('/signup' , Authentication.SignUp);

router.post('/refresh-token' , Authentication.RefreshToken)


module.exports = router;