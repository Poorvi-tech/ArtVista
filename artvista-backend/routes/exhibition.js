const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Health/status endpoint for exhibition service
router.get('/status', (req, res) => {
    res.json({ status: 'ok', service: 'exhibition' });
});

// Mock artworks for demo/fallback
const mockArtworks = [
    {
        _id: "1",
        title: "Sunset Dreams",
        artist: "Alex Rivera",
        imageUrl: "/images/artwork1.jpg",
        category: "landscape",
        likes: 124,
        createdAt: "2023-06-15",
        description: "A vibrant sunset landscape painting"
    },
    {
        _id: "2",
        title: "Urban Symphony",
        artist: "Maya Chen",
        imageUrl: "/images/artwork2.jpg",
        category: "urban",
        likes: 89,
        createdAt: "2023-07-22",
        description: "Abstract representation of city life"
    },
    {
        _id: "3",
        title: "Portrait of Hope",
        artist: "James Wilson",
        imageUrl: "/images/artwork3.jpg",
        category: "portrait",
        likes: 156,
        createdAt: "2023-08-10",
        description: "Emotional portrait capturing human resilience"
    },
    {
        _id: "4",
        title: "Abstract Waves",
        artist: "Sarah Kim",
        imageUrl: "/images/artwork4.jpg",
        category: "abstract",
        likes: 203,
        createdAt: "2023-05-30",
        description: "Fluid abstract composition with dynamic colors"
    },
    {
        _id: "5",
        title: "Mountain Serenity",
        artist: "David Thompson",
        imageUrl: "/images/sunset-mountains.jpg",
        category: "landscape",
        likes: 97,
        createdAt: "2023-09-05",
        description: "Peaceful mountain landscape at dawn"
    },
    {
        _id: "6",
        title: "Colorful Dreams",
        artist: "Sophie Williams",
        imageUrl: "/images/artwork6.jpg",
        category: "abstract",
        likes: 178,
        createdAt: "2023-10-18",
        description: "Vibrant abstract art representing dreams"
    }
];

// Get AI-curated exhibition
router.get('/curated', async (req, res) => {
    try {
        // In a real implementation, this would connect to the AI service
        // For now, we'll simulate AI curation based on user preferences
        
        // Get all artworks from database
        const allArtworks = await Artwork.find();
        
        // If database is empty, use mock artworks
        const artworkList = allArtworks.length > 0 ? allArtworks : mockArtworks;
        
        // Simulate AI curation (in reality, this would call the Python AI service)
        // For demo purposes, we'll randomly select 6 artworks
        const shuffled = [...artworkList].sort(() => 0.5 - Math.random());
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
        
        // Get from database first
        let dbArtworks;
        switch(theme) {
            case 'landscapes':
                dbArtworks = await Artwork.find({ category: { $in: ['Landscapes', 'landscape', 'Nature'] } });
                break;
            case 'urban':
                dbArtworks = await Artwork.find({ category: { $in: ['Urban', 'urban'] } });
                break;
            case 'abstract':
                dbArtworks = await Artwork.find({ category: { $in: ['Abstract', 'abstract'] } });
                break;
            default:
                dbArtworks = await Artwork.find();
        }
        
        // Use database results, or fallback to mock data if empty
        let artworks;
        if (dbArtworks.length > 0) {
            artworks = dbArtworks;
        } else {
            // Fallback to mock artworks filtered by theme
            switch(theme) {
                case 'landscapes':
                    artworks = mockArtworks.filter(art => art.category === 'landscape');
                    break;
                case 'urban':
                    artworks = mockArtworks.filter(art => art.category === 'urban');
                    break;
                case 'abstract':
                    artworks = mockArtworks.filter(art => art.category === 'abstract');
                    break;
                default:
                    artworks = mockArtworks;
            }
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