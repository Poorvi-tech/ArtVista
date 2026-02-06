const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Get all artworks
router.get('/', async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get artworks by category
router.get('/category/:category', async (req, res) => {
    try {
        const artworks = await Artwork.find({ category: req.params.category });
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload artwork
router.post('/upload', async (req, res) => {
    const { title, category, imageUrl, description } = req.body;
    try {
        const newArtwork = new Artwork({ title, category, imageUrl, description });
        await newArtwork.save();
        res.json(newArtwork);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
