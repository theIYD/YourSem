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
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

//Routes
const semesters = require('./routes/semesters');
const marks = require('./routes/marks');
const users = require('./routes/users');

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

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//Passport Middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    next();
});

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

//Bring in all routes
app.use('/semesters', semesters);
app.use('/marks', marks);
app.use('/users', users);

