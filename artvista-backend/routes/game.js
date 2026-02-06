const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Get all games
router.get('/games', async (req, res) => {
  // Mock data for games
  const mockGames = [
    { 
      id: 1, 
      title: "Drag & Drop Scene Maker", 
      description: "Create beautiful scenes by dragging elements onto the canvas",
      difficulty: "Beginner to Expert",
      features: ["AI-powered suggestions", "Dynamic difficulty adjustment", "Leaderboard"]
    },
    { 
      id: 2, 
      title: "Jigsaw Puzzle", 
      description: "Complete puzzles of famous artworks",
      difficulty: "Easy to Hard",
      features: ["Multiple puzzle sizes", "Hint system", "Time tracking"]
    }
  ];
  
  res.json(mockGames);
});

// Start a new game session
router.post('/start', async (req, res) => {
  try {
    const { user_name, user_id } = req.body;
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI game service
    const gameServiceUrl = process.env.AI_GAME_URL || 'http://localhost:5002';
    const response = await fetch(`${gameServiceUrl}/start_game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name, user_id })
    });
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to start game session' });
    }
    
    const gameData = await response.json();
    res.json(gameData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

// Choose background for the game
router.post('/choose_background/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    const { background } = req.body;
    
    // Call the Python AI game service
    const gameServiceUrl = process.env.AI_GAME_URL || 'http://localhost:5002';
    const response = await fetch(`${gameServiceUrl}/choose_background/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ background })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Failed to choose background: ${errorText}` });
    }
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to choose background' });
  }
});

// Add element to the scene
router.post('/add_element/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    const { element } = req.body;
    
    // Call the Python AI game service
    const gameServiceUrl = process.env.AI_GAME_URL || 'http://localhost:5002';
    const response = await fetch(`${gameServiceUrl}/add_element/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ element })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Failed to add element: ${errorText}` });
    }
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add element' });
  }
});

// Check scene completion
router.get('/check_scene/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    
    // Call the Python AI game service
    const gameServiceUrl = process.env.AI_GAME_URL || 'http://localhost:5002';
    const response = await fetch(`${gameServiceUrl}/check_scene/${gameId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Failed to check scene: ${errorText}` });
    }
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check scene' });
  }
});

// Get AI suggestions for the game
router.get('/suggestions/:gameId', async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI game service
    const gameServiceUrl = process.env.AI_GAME_URL || 'http://localhost:5002';
    const response = await fetch(`${gameServiceUrl}/get_suggestions/${gameId}`);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to get game suggestions' });
    }
    
    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game suggestions' });
  }
});

// Submit score (update if higher score for same user optional)
router.post('/submit', async (req, res) => {
    const { user, score, level = 1 } = req.body;
    try {
        // Optional: check if user already has a higher score
        const existing = await Game.findOne({ user });
        if (existing && existing.score >= score) {
            return res.json({ message: 'Score not higher than existing', game: existing });
        }

        const game = new Game({ user: user.toString(), score, level });
        await game.save();
        res.json({ message: 'Score submitted', game });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard from database
router.get('/leaderboard/db', async (req, res) => {
    try {
        const leaderboard = await Game.find()
            .sort({ score: -1, level: -1 })
            .limit(10);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Game.find()
      .sort({ score: -1, level: -1 })
      .limit(10);
    
    // Transform the data to match frontend expectations
    const transformedLeaderboard = leaderboard.map((record, index) => ({
      _id: record._id,
      player: `Player_${record.user.substring(0, 8)}`, // Display only part of user ID
      score: record.score,
      game: 'Various', // Placeholder since we don't store game type
      timestamp: record.completedAt,
      level: record.level || 'N/A'
    }));
    
    res.json(transformedLeaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
