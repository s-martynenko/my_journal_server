const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitEventSchema = new Schema({
    checked: {
        type: Boolean,
        default: false,
        required: "Checked value is required - default value is FALSE"
    }
});

const habitArraySchema = new Schema({
    title: {
        type: String,
        required: "Title is required",
        max: [280, 'Max 280 symbols']
    },
    tracking: [habitEventSchema]
});

module.exports = mongoose.model('HabitEvent', habitEventSchema);
module.exports = mongoose.model('HabitArray', habitArraySchema);
