const mongoose = require('mongoose');
const { Schema } = mongoose;

const certificateSchema = new Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    certID: { type: String, required: true }
});

module.exports = mongoose.model('Certificate', certificateSchema);
