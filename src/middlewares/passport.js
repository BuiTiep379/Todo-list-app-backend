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
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name']
    },
        // Facebook sẽ gửi lại chuối token và thông tin profile của user
        async (token, refreshToken, profile, done) => {
            const user = await User.findOne({ 'fb.id': profile.id });
            console.log(user);
            if (user) {
                return done(null, user);
            } else {
                const { id, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
                const email = profile.emails[0].value;
                let newUser = new User();
                newUser.fb.id = id; // set the users facebook id	
                newUser.fb.displayName = displayName;
                newUser.fb.firstName = firstName;
                newUser.fb.lastName = lastName; // look at the passport user profile to see how names are returned
                newUser.fb.email = email; // facebook can return multiple emails so we'll take the first
                await newUser.save();
                done(null, newUser);
            }
            // process.nextTick(function () {
            //     User.findOne({ 'fb.id': profile.id }, function (err, user) {
            //         // if there is an error, stop everything and return that
            //         // ie an error connecting to the database
            //         if (err) {
            //             return done(err);
            //         } if (user) {
            //             return done(null, user);
            //         } else {
            //             const { id, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
            //             const email = profile.emails[0].value;
            //             let newUser = new User();
            //             newUser.fb.id = id; // set the users facebook id	
            //             newUser.fb.displayName = displayName;
            //             newUser.fb.firstName = firstName;
            //             newUser.fb.lastName = lastName; // look at the passport user profile to see how names are returned
            //             newUser.fb.email = email; // facebook can return multiple emails so we'll take the first
            //             // save our user to the database
            //             newUser.save(function (err) {
            //                 if (err)
            //                     throw err;
            //                 // if successful, return the new user
            //                 return done(null, newUser);
            //             });
            //         }
            //     });
            // });
        }
    )
    );


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
                const user = await User.findOne({ 'gg.id': profile.id });
                console.log(user);
                if (user) {
                    return cb(null, user);
                } else {
                    console.log(profile);
                    const { id, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
                    const email = profile.emails[0].value;
                    let newUser = new User();
                    newUser.gg.id = id; // set the users facebook id	
                    newUser.gg.displayName = displayName;
                    newUser.gg.firstName = firstName;
                    newUser.gg.lastName = lastName; // look at the passport user profile to see how names are returned
                    newUser.gg.email = email; // facebook can return multiple emails so we'll take the first
                    await newUser.save();
                    cb(null, newUser);
                }
                // process.nextTick(function () {
                //     User.findOne({ 'gg.id': profile.id }, function (err, user) {
                //         if (err) {
                //             return cb(err);
                //         } if (user) {
                //             return cb(null, user);
                //         } else {
                //             console.log(profile);
                //             const { id, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
                //             const email = profile.emails[0].value;
                //             let newUser = new User();
                //             newUser.gg.id = id; // set the users facebook id	
                //             newUser.gg.displayName = displayName;
                //             newUser.gg.firstName = firstName;
                //             newUser.gg.lastName = lastName; // look at the passport user profile to see how names are returned
                //             newUser.gg.email = email; // facebook can return multiple emails so we'll take the first
                //             console.log(newUser);
                //             // save our user to the database
                //             newUser.save(function (err) {
                //                 if (err)
                //                     throw err;
                //                 // if successful, return the new user
                //                 return cb(null, newUser);
                //             });
                //         }
                //     })
                // })

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