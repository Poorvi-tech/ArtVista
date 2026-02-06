const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artworkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
        required: true
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    shares: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        platform: {
            type: String // e.g., 'facebook', 'twitter', 'instagram'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Social', SocialSchema);