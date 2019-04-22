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
        maxlength: [280, 'Max 280 symbols']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);