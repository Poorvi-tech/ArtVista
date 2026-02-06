const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Add a new comment
router.post('/', async (req, res) => {
    const { user, artwork, blog, content } = req.body;
    try {
        const comment = new Comment({ user, artwork, blog, content });
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get comments for a specific artwork
router.get('/artwork/:artworkId', async (req, res) => {
    try {
        const comments = await Comment.find({ artwork: req.params.artworkId })
            .populate('user', 'name');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get comments for a specific blog
router.get('/blog/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId })
            .populate('user', 'name');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
