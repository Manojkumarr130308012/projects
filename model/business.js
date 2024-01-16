const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    }
});

module.exports = new mongoose.model('business', businessSchema);
