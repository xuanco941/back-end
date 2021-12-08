const express = require('express');
const router = express.Router();

const LoginAdmin = require('../admin/LoginAdmin');


router.post('/login', LoginAdmin.LogIn);
router.post('/logup', LoginAdmin.LogUp);

module.exports = router;