//Bring the modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');

//Bring in models
require('../models/Marks');
require('../models/Setup');
const M_SETUP = mongoose.model('SetupModel');
const M_MARKS = mongoose.model('MarksModel');

//Edit marks route
router.get('/edit_marks/semester_number=:number/:id', ensureAuthenticated, (req, res) => {
    M_MARKS.findOne({
            semester_number: req.params.number
        })
        .then(eachSubMarks => {
            if (eachSubMarks.user !== req.user.id) {
                req.flash('errorMsg', 'Not authorized');
                res.redirect('/welcome');
            } else {
                res.render('marks/edit', {
                    marksToBeEdited: eachSubMarks
                });
            }

        });
});

//Update the marks
router.put('/edit_marks/semester_number=:number/:id', ensureAuthenticated, (req, res) => {
    M_MARKS.findOne({
            semester_number: req.params.number
        })
        .then(updated_marks => {
            updated_marks.obtained_marks = req.body.subj_obtained_marks;
            updated_marks.maximum_marks = req.body.subj_max_marks;

            updated_marks.save()
                .then(updated_marks => {
                    req.flash('successMsg', 'Marks updated');
                    res.redirect('/semesters');
                });
        });
});

//Enter semester marks
router.get('/add_marks/:id', ensureAuthenticated, (req, res) => {
    M_SETUP.findOne({
            _id: req.params.id
        })
        .then(sem => {
            //console.log(sem)
            if (sem.user !== req.user.id) {
                req.flash('errorMsg', 'Not authorized');
                res.redirect('/welcome');
            } else {
                res.render('marks/add_marks', {
                    sem: sem
                });
            }

        });
});

//Post the entered marks to database.
router.post('/add_marks/semester_number=:number/:id', ensureAuthenticated, (req, res) => {
    //console.log(req.body);
    const subjMarks = {
        semester_number: req.params.number,
        subject_name: req.body.subjName,
        obtained_marks: req.body.subj_obtained_marks,
        maximum_marks: req.body.subj_max_marks,
        user: req.user.id
    };

    new M_MARKS(subjMarks)
        .save()
        .then(marks => {
            req.flash('successMsg', 'Marks have been added successfully')
            res.redirect('/semesters');
        });
});

module.exports = router;