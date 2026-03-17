const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    user: { type: String, required: true },
    score: { type: Number, default: 0 },
    // Metadata kept for display/grouping. (This collection represents "best score per user".)
    level: { type: String, default: 'N/A' },
    game: { type: String, default: 'Various' },
    difficulty: { type: String, default: 'N/A' },
    displayName: { type: String, default: '' },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
