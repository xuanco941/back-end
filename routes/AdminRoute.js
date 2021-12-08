const express = require('express');
const router = express.Router();

const LoginAdmin = require('../controller/SignInAdmin');


router.post('/signin', LoginAdmin.SignIn);
router.post('/signup', LoginAdmin.SignUp);
router.post('/refresh-token' , LoginAdmin.RefreshToken);

module.exports = router;