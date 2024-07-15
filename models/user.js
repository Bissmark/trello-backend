const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    googleId: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true,
});

userSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
    }
});

module.exports = mongoose.model('User', userSchema);