const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);