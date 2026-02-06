const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    user: { type: String, required: true },
    score: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
