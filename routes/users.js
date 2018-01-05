//Bring the modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//User Login router
router.get('/login', (req, res) => {
    res.send('login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.send('register');
});

module.exports = router;