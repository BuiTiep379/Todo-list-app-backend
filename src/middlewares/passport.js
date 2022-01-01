const mongoose = require('mongoose');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;
// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy

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

const passportGoogle = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, cb) => {
                const { id: googleId, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
                const image = profile.photos[0].value;
                const newUser = { googleId, displayName, lastName, firstName, image };
                try {
                    let user = await User.findOne({ googleId });
                    console.log(user);
                    if (user) {
                        cb(null, user);
                    } else {
                        user = await User.create(newUser);
                        cb(null, user);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        )
    )


    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}

module.exports = {
    passportFacebook,
    passportGoogle,
}