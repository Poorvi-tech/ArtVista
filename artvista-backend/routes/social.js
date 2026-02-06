const express = require('express');
const router = express.Router();
const Social = require('../models/Social');
const Artwork = require('../models/Artwork');
const User = require('../models/User');

// Get social interactions for an artwork
router.get('/artwork/:artworkId', async (req, res) => {
    try {
        const social = await Social.findOne({ artworkId: req.params.artworkId })
            .populate('likes.userId', 'name')
            .populate('comments.userId', 'name');
        
        if (!social) {
            return res.json({
                likes: [],
                comments: [],
                shares: [],
                likeCount: 0,
                commentCount: 0
            });
        }
        
        res.json({
            likes: social.likes,
            comments: social.comments,
            shares: social.shares,
            likeCount: social.likes.length,
            commentCount: social.comments.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like an artwork
router.post('/like', async (req, res) => {
    try {
        const { userId, artworkId } = req.body;
        
        let social = await Social.findOne({ artworkId });
        
        if (!social) {
            social = new Social({
                userId,
                artworkId,
                likes: [{ userId }],
                comments: [],
                shares: []
            });
        } else {
            // Check if user already liked
            const existingLike = social.likes.find(like => like.userId.toString() === userId);
            if (existingLike) {
                return res.status(400).json({ message: 'Already liked' });
            }
            social.likes.push({ userId });
        }
        
        await social.save();
        
        res.json({
            message: 'Artwork liked successfully',
            likeCount: social.likes.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unlike an artwork
router.delete('/like', async (req, res) => {
    try {
        const { userId, artworkId } = req.body;
        
        const social = await Social.findOne({ artworkId });
        
        if (!social) {
            return res.status(400).json({ message: 'No likes found for this artwork' });
        }
        
        social.likes = social.likes.filter(like => like.userId.toString() !== userId);
        await social.save();
        
        res.json({
            message: 'Artwork unliked successfully',
            likeCount: social.likes.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add comment to artwork
router.post('/comment', async (req, res) => {
    try {
        const { userId, artworkId, text } = req.body;
        
        let social = await Social.findOne({ artworkId });
        
        if (!social) {
            social = new Social({
                userId,
                artworkId,
                likes: [],
                comments: [{ userId, text }],
                shares: []
            });
        } else {
            social.comments.push({ userId, text });
        }
        
        await social.save();
        
        // Populate user info for the new comment
        const populatedSocial = await Social.findById(social._id)
            .populate('comments.userId', 'name');
        
        const newComment = populatedSocial.comments[populatedSocial.comments.length - 1];
        
        res.json({
            message: 'Comment added successfully',
            comment: newComment,
            commentCount: social.comments.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Share artwork
router.post('/share', async (req, res) => {
    try {
        const { userId, artworkId, platform } = req.body;
        
        let social = await Social.findOne({ artworkId });
        
        if (!social) {
            social = new Social({
                userId,
                artworkId,
                likes: [],
                comments: [],
                shares: [{ userId, platform }]
            });
        } else {
            social.shares.push({ userId, platform });
        }
        
        await social.save();
        
        res.json({
            message: `Artwork shared on ${platform}`,
            shareCount: social.shares.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's social activity
router.get('/user/:userId', async (req, res) => {
    try {
        const socialActivities = await Social.find({ userId: req.params.userId })
            .populate('artworkId', 'title imageUrl')
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json(socialActivities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;