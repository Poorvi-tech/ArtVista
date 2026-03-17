const mongoose = require('mongoose');

// Append-only event log for time-series graphs and analytics.
const GameScoreEventSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    level: { type: String, default: 'N/A' },
    game: { type: String, default: 'Various' },
    difficulty: { type: String, default: 'N/A' },
    displayName: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

GameScoreEventSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('GameScoreEvent', GameScoreEventSchema);

