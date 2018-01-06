const mongoose = require('mongoose');

let marksModel = mongoose.Schema({
    semester_number: {
        type: Number,
        required: true
    },
    subject_name: {
        type: [Array],
        required: true
    },
    obtained_marks: {
        type: [Number],
        required: true
    },
    maximum_marks: {
        type: [Number],
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

mongoose.model('MarksModel', marksModel); 