const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitArraySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastDay: {
        type: Date,
        required: "Date is required"
    },
    title: {
        type: String,
        required: "Title is required",
        max: [280, 'Max 280 symbols']
    },
    tracking: [Boolean]
});

module.exports = mongoose.model('HabitArray', habitArraySchema);
