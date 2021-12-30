const mongoose = require('mongoose');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;

const passportFacebook = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_KEY,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        // profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
    },
        // Facebook sẽ gửi lại chuối token và thông tin profile của user
        async (token, refreshToken, profile, done) => {
            console.log(profile);
        }
    ));
    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

};


module.exports = {
    passportFacebook,

}