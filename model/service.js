const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    }
});

module.exports = new mongoose.model('service', serviceSchema);
