const express = require('express');
const router = express.Router();
const { validateSignin, validateSignup, isRequestValidated } = require('../validator/user');
const { signin, signup, signout } = require('../controllers/user');

router.route('/signin').post(validateSignin, isRequestValidated, signin);
router.route('/signup').post(validateSignup, isRequestValidated, signup);
router.route('/signout').get(signout);
module.exports = router;
