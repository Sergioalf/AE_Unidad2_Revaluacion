var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
});
