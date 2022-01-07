const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireSignin } = require('../middlewares/user-middleware');
const { ensureAuth, ensureGuest } = require('../middlewares/login-middleware');


router.route('/dashboard').get(ensureAuth, async (req, res) => {
    try {
        const user = await User.find({ _id: req.user._id }).lean()
        res.render('dashboard', {
            name: req.user.fb.firstName || req.user.gg.firstName || req.user.lc.firstName,
            user,
        })
    } catch (err) {
        console.error(err)
    }
});
router.route('/signup').get(ensureGuest, (req, res) => {
    res.render('signup', {
        layout: 'login',
    })
});
router.route('/').get(ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
});


module.exports = router;