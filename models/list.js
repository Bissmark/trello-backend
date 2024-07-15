const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    title: String,
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('List', listSchema);
