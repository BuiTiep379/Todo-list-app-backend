const express = require('express');
const router = express.Router();
const { validateSignin, validateSignup, isRequestValidated } = require('../validator/user');
const { signin, signup } = require('../controllers/user');

router.route('/signin').post(signin);
router.route('/signup').post(validateSignup, isRequestValidated, signup);

module.exports = router;
