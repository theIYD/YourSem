//Bring the modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const async = require('async');
const {
    ensureAuthenticated
} = require('../helpers/auth');

//Bring in models
require('../models/Marks');
require('../models/Setup');
const M_SETUP = mongoose.model('SetupModel');
const M_MARKS = mongoose.model('MarksModel');

//Show the marks
router.get('/show_marks/semester_number=:number/:id', ensureAuthenticated, (req, res) => {
    M_MARKS.find({
            semester_number: req.params.number,
            user: req.user.id
        })
        .then(eachSubjectMarks => {
            res.render('semesters/details', {
                details: eachSubjectMarks
            });

        });
});

//Setup the semester
router.get('/add_semester', ensureAuthenticated, (req, res) => {
    res.render('semesters/add_semester');
});

//Display all the semesters
router.get('/', ensureAuthenticated, (req, res, next) => {
    M_SETUP.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(eachSem => {
            res.render('semesters/semester', {
                eachSem: eachSem
            });
        });
});

//Add the college name and semester
router.post('/add_semester', ensureAuthenticated, (req, res) => {
    //console.log(req.body);
    const newSemester = {
        college_name: req.body.collegeName,
        sem_number: req.body.semNumber,
        subjects: req.body.subject,
        subjectCount: req.body.subject_count,
        user: req.user.id
    };

    new M_SETUP(newSemester)
        .save()
        .then(setup => res.redirect('/semesters'));
});

module.exports = router;