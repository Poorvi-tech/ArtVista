const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get all games
router.get('/games', async (req, res) => {
  // Mock data for games
  const mockGames = [
    { 
      id: 1,
      title: "Memory Match",
      description: "Match pairs of art-related items in this classic memory game",
      difficulty: "Easy to Hard",
      features: ["Multiple themes", "Timer", "Scoring"]
    },
    { 
      id: 2,
      title: "Color Mixing",
      description: "Mix RGB colors to match target colors and become a color master",
      difficulty: "Easy to Hard",
      features: ["Target matching", "Hints", "Time tracking"]
    },
    {
      id: 3,
      title: "Art History Quiz",
      description: "Test your knowledge of artists, movements, and masterpieces",
      difficulty: "Easy to Hard",
      features: ["Multiple difficulty levels", "Scoring", "Review answers"]
    }
  ];
  
  res.json(mockGames);
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
