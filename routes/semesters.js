//Bring the modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Bring in models
require('../models/Marks');
require('../models/Setup');
const M_SETUP = mongoose.model('SetupModel');
const M_MARKS = mongoose.model('MarksModel');

//Show the marks
router.get('/show_marks/semester_number=:number/:id', (req, res) => {
    M_MARKS.findOne({
            semester_number: req.params.number
        })
        .then(eachSubjectMarks => {
            res.render('semesters/details', {
                details: eachSubjectMarks
            });
        });
});

//Setup the semester
router.get('/add_semester', (req, res) => {
    res.render('setup');
});

//Display all the semesters
router.get('/', (req, res) => {
    M_SETUP.find({})
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
router.post('/add_semester', (req, res) => {
    //console.log(req.body);
    const newSemester = {
        college_name: req.body.collegeName,
        sem_number: req.body.semNumber,
        subjects: req.body.subject,
        subjectCount: req.body.subject_count
    };

    new M_SETUP(newSemester)
        .save()
        .then(setup => res.redirect('/'));
});

module.exports = router;