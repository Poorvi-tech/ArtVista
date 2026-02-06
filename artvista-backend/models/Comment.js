const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
