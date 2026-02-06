const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use MongoDB User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Validate password for regular users
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isGoogleUser: false // Regular user registration
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if user is a Google user (no password)
        if (user.isGoogleUser) {
            return res.status(400).json({ error: 'Please login with Google' });
        }

        // Check password for regular users
        if (!user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google authentication (simulated for demo)
router.post('/google', async (req, res) => {
    try {
        // In a real implementation, you would verify the Google ID token
        // For demo purposes, we'll create/fetch a user
        
        // Extract data from the request body (in a real app, this would be the Google ID token)
        const { tokenId, googleId, email, name } = req.body;
        
        // For demo purposes, if no email is provided, generate a simulated one
        const userEmail = email || `user${Date.now()}@gmail.com`;
        const userName = name || `Google User ${Date.now()}`;
        
        // Check if user already exists
        let user = await User.findOne({ email: userEmail });
        
        if (user) {
            // User exists, return existing user
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.json({
                message: 'Google login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } else {
            // User doesn't exist, create new user
            const newUser = new User({
                name: userName,
                email: userEmail,
                password: null, // Google users don't have password
                isGoogleUser: true
            });
            
            await newUser.save();
            
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.json({
                message: 'Google registration successful',
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify token (for protected routes)
router.post('/verify-token', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token missing' });
    }

    try {
        // Verify token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;