const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const merchantSchema = new mongoose.Schema({
    businessId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'business' 
    },
    merchaneName: {
        type: String,
        required: false,
    }
});

module.exports = new mongoose.model('Merchant', merchantSchema);
