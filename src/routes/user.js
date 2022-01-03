const express = require('express');
const router = express.Router();
const { validateSignin, validateSignup, isRequestValidated } = require('../validator/user');
const { signin, signup, signout } = require('../controllers/user');
const passport = require('passport');



router.route('/signin').post(validateSignin, isRequestValidated, signin);
router.route('/signup').post(validateSignup, isRequestValidated, signup);
router.route('/signout').get(signout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect success.
        res.redirect('/dashboard');
    });

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    })
);
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
module.exports = router;
