const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Get AI suggestions for a user
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI service
    const response = await fetch(`http://localhost:5001/adaptive_suggest?user_id=${userId}`);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch AI suggestions from Python service' });
    }
    
    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI suggestions' });
  }
});

// Track user interaction with artwork
router.post('/interaction/artwork', (req, res) => {
  try {
    const { userId, artworkId, interactionType } = req.body;
    
    // In a real implementation, this would update the user's interaction history
    // updateInteractionHistory(userId, artworkId, interactionType);
    
    res.json({ success: true, message: 'Interaction recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

// Track user interaction with tutorial
router.post('/interaction/tutorial', (req, res) => {
  try {
    const { userId, tutorialId, interactionType } = req.body;
    
    // In a real implementation, this would update the user's interaction history
    // updateTutorialInteractionHistory(userId, tutorialId, interactionType);
    
    res.json({ success: true, message: 'Tutorial interaction recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record tutorial interaction' });
  }
});

// Get AI-powered art creation suggestions
router.get('/art-creation/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI service
    const response = await fetch(`http://localhost:5001/art_creation_suggestions/${userId}`);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch art creation suggestions from Python service' });
    }
    
    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate art creation suggestions' });
  }
});

module.exports = router;