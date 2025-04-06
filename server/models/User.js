const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferredCity: {
        type: String,
        default: null,
    },
    settings: {
        temperatureUnit: {
            type: String,
            enum: ['celsius', 'fahrenheit'],
            default: 'celsius',
        },
        notifications: {
            type: Boolean,
            default: false,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);