const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new blog
router.post('/add', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const newBlog = new Blog({ title, content, author });
        await newBlog.save();
        res.json(newBlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
