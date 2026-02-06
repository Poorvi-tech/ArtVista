const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Artwork = require('../models/Artwork');

// Get user profile with AI insights
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('favoriteArtworks')
            .populate('createdArtworks');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Simulate AI insights (in a real app, this would call an AI service)
        const aiInsights = generateAIInsights(user);
        
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                favoriteArtworks: user.favoriteArtworks,
                createdArtworks: user.createdArtworks,
                aiInsights: aiInsights,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user preferences
router.put('/:userId/preferences', async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { preferences },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'Preferences updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add artwork to favorites
router.post('/:userId/favorites', async (req, res) => {
    try {
        const { artworkId } = req.body;
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (!user.favoriteArtworks.includes(artworkId)) {
            user.favoriteArtworks.push(artworkId);
            await user.save();
        }
        
        res.json({ message: 'Artwork added to favorites', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Simulate AI insights generation
function generateAIInsights(user) {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate based on user data
    
    const styles = ['Abstract', 'Landscape', 'Portrait', 'Urban', 'Nature'];
    const artists = ['Picasso', 'Van Gogh', 'Monet', 'Kandinsky', 'Frida Kahlo'];
    
    // Determine skill level based on created artworks
    let skillLevel = 'Beginner';
    if (user.createdArtworks && user.createdArtworks.length > 10) {
        skillLevel = 'Expert';
    } else if (user.createdArtworks && user.createdArtworks.length > 5) {
        skillLevel = 'Intermediate';
    }
    
    return {
        favoriteStyles: user.preferences && user.preferences.length > 0 
            ? user.preferences.slice(0, 3) 
            : [styles[Math.floor(Math.random() * styles.length)]],
        recommendedArtists: [
            artists[Math.floor(Math.random() * artists.length)],
            artists[Math.floor(Math.random() * artists.length)]
        ],
        skillLevel: skillLevel,
        lastActive: user.createdAt
    };
}

module.exports = router;