//Bring the modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Bring in models
require('../models/Marks');
require('../models/Setup');
const M_SETUP = mongoose.model('SetupModel');
const M_MARKS = mongoose.model('MarksModel');

//Edit marks route
router.get('/edit_marks/semester_number=:number/:id', (req, res) => {
    M_MARKS.findOne({
            semester_number: req.params.number
        })
        .then(eachSubMarks => {
            res.render('marks/edit', {
                marksToBeEdited: eachSubMarks
            });
        });
});

//Update the marks
router.put('/edit_marks/semester_number=:number/:id', (req, res) => {
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
router.get('/add_marks/:id', (req, res) => {
    M_SETUP.findOne({
            _id: req.params.id
        })
        .then(sem => {
            console.log(sem)
            res.render('marks/add_marks', {
                sem: sem
            });
        });
});

//Post the entered marks to database.
router.post('/add_marks/semester_number=:number/:id', (req, res) => {
    //console.log(req.body);
    const subjMarks = {
        semester_number: req.params.number,
        subject_name: req.body.subjName,
        obtained_marks: req.body.subj_obtained_marks,
        maximum_marks: req.body.subj_max_marks
    };

    new M_MARKS(subjMarks)
        .save()
        .then(marks => {
            req.flash('successMsg', 'Marks have been added successfully')
            res.redirect('/');
        });
});

module.exports = router;