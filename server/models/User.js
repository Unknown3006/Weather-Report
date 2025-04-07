const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    preferredCity: {
        type: String,
        required: false, // Make it optional
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