const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: "Title is required",
        max: [280, 'Max 280 symbols']
    },
    date: {
        type: Date,
        default: Date.now,
        required: "Date is required - default value is the created date"
    }
});

module.exports = mongoose.model('Event', eventSchema);