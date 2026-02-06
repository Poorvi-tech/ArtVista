const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/spotlight', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ /* e.g., points, number of posts, etc */ }) 
            .limit(5)
            .select('name email');
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
