const mongoose = require('mongoose');

let setupModel = mongoose.Schema({
    college_name: {
        type: String,
        required: true
    },
    sem_number: {
        type: Number,
        required: true
    },
    subjects: {
        type: [Array],
        required: true
    },
    subject_count: {
        type: Number
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('SetupModel', setupModel); 