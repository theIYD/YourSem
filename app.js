/*
    Application Name: YourSem
    Author: Idrees Dargahwala
    Description: Store your final semester marks.
*/

//Bring the modules
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

//Bring in Models
require('./models/Setup');
require('./models/Marks');
const M_MARKS = mongoose.model('MarksModel')
const M_SETUP = mongoose.model('SetupModel');

//Mongoose middleware
mongoose.connect('mongodb://localhost/your_sem');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDB is connected to the application ......')
});

//engine
app.engine('handlebars', hbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set Client Folder
app.use(express.static(path.join(__dirname, 'client')));

//Method Override Middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Listen port
const port = 4000;
app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`);
});

//Home route
app.get('/', (req, res) => {
    res.render('index');
});

//Setup the semester
app.get('/add_semester', (req, res) => {
    res.render('setup');
});

//Show the marks
app.get('/semesters/show_marks/semester_number=:number/:id', (req, res) => {
    M_MARKS.findOne({
        semester_number: req.params.number
    })
    .then(eachSubjectMarks => {
        res.render('semesters/details', {
            details: eachSubjectMarks
        });
    });
});

//Edit marks route
app.get('/edit_marks/semester_number=:number/:id', (req, res) => {
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
app.put('/edit_marks/semester_number=:number/:id', (req, res) => {
    M_MARKS.findOne({
        semester_number: req.params.number
    })
    .then(updated_marks => {
        updated_marks.obtained_marks = req.body.subj_obtained_marks;
        updated_marks.maximum_marks = req.body.subj_max_marks;

        updated_marks.save()
        .then(updated_marks => {
            res.redirect('/semesters');
        });
    });
});

//Display all the semesters
app.get('/semesters/', (req, res) => {
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
app.post('/add_semester/initialize', (req, res) => {
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

//Enter semester marks
app.get('/add_marks/:id', (req, res) => {
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
app.post('/add_marks/semester_number=:number/:id', (req, res) =>{
    //console.log(req.body);
    const subjMarks = {
        semester_number: req.params.number,
        subject_name: req.body.subjName,
        obtained_marks: req.body.subj_obtained_marks,
        maximum_marks: req.body.subj_max_marks
    };

    new M_MARKS(subjMarks)
        .save()
        .then(marks => res.redirect('/'));
});