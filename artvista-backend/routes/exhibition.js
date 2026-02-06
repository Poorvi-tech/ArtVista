const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Get AI-curated exhibition
router.get('/curated', async (req, res) => {
    try {
        // In a real implementation, this would connect to the AI service
        // For now, we'll simulate AI curation based on user preferences
        
        // Get all artworks
        const allArtworks = await Artwork.find();
        
        // Simulate AI curation (in reality, this would call the Python AI service)
        // For demo purposes, we'll randomly select 6 artworks
        const shuffled = [...allArtworks].sort(() => 0.5 - Math.random());
        const curatedExhibition = shuffled.slice(0, 6);
        
        res.json({
            title: "AI Curated Exhibition",
            description: "Discover artworks selected just for you by our AI curator",
            artworks: curatedExhibition,
            theme: "Mixed Media Exploration"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get themed exhibitions
router.get('/themed/:theme', async (req, res) => {
    try {
        const theme = req.params.theme;
        let artworks;
        
        switch(theme) {
            case 'landscapes':
                artworks = await Artwork.find({ category: { $in: ['Landscapes', 'Nature'] } });
                break;
            case 'urban':
                artworks = await Artwork.find({ category: 'Urban' });
                break;
            case 'abstract':
                artworks = await Artwork.find({ category: 'Abstract' });
                break;
            default:
                artworks = await Artwork.find();
        }
        
        res.json({
            title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Collection`,
            description: `A curated collection of ${theme} artworks`,
            artworks: artworks,
            theme: theme
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;