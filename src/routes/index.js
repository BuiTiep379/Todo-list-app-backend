const express = require('express');
const router = express.Router();
const User = require('../models/user');

const { ensureAuth, ensureGuest } = require('../middlewares/login-middleware');


router.route('/dashboard').get(ensureAuth, async (req, res) => {
    try {
        const user = await User.find({ user: req.user._id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            user,
        })
    } catch (err) {
        console.error(err)
    }
});
router.route('/').get(ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
});


module.exports = router;