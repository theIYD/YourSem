//Bring the modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

//Bring in User Model
require('../models/User');
const User = mongoose.model('UserModel');

//User Login router
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form POST
router.post('/register', (req, res) => {
    let errors = [];
    //Check passwords match 
    if (req.body.password !== req.body.password2) {
        errors.push({
            text: 'Passwords do not match'
        });
    }
    //Check length of password
    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password must be at least of 4 characters'
        });
    }
    //If an error exists
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    req.flash('errorMsg', `${user.email} already registered`);
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw new Error(err);
                            newUser.password = hash;
                            newUser.save()
                                .then((user) => {
                                    req.flash('successMsg', 'You are now registered & can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});

//Log out
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successMsg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;