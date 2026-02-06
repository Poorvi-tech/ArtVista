const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
