const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Make password optional to support Google auth
    isGoogleUser: { type: Boolean, default: false }, // Flag to identify Google users
    googleId: { type: String }, // Google ID for OAuth
    picture: { type: String }, // Profile picture URL from Google
    preferences: [{
        type: String
    }],
    favoriteArtworks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork'
    }],
    createdArtworks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork'
    }],
    aiInsights: {
        favoriteStyles: [{
            type: String
        }],
        recommendedArtists: [{
            type: String
        }],
        skillLevel: {
            type: String,
            default: 'Beginner'
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
