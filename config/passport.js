const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('UserModel');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'name'
    }, (name, password, done) => {
        //console.log(name, password);

        User.findOne({
                name: name
            })
            .then((user) => {
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Password Incorrect'
                        });
                    }
                });
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

};