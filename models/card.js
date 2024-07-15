const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    title: String,
    description: String,
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
