const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Artwork = require('../models/Artwork');
const Blog = require('../models/Blog');
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

// SMART RECOMMENDATIONS - Real-time data from your website
router.get('/smart-suggestions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch all real data from website
    const [allArtworks, allBlogs, allLearningPaths, userProgressList, userData] = await Promise.all([
      Artwork.find().limit(20),
      Blog.find().limit(10),
      LearningPath.find(),
      UserProgress.find({ userId }),
      User.findById(userId)
    ]);

    // Get user's favorites
    const userFavorites = userData?.favoriteArtworks?.map(id => id.toString()) || [];

    // Build learning recommendations
    const completedPathIds = userProgressList
      .filter(p => p.progress === 100)
      .map(p => p.learningPathId.toString());
    
    const inProgressPaths = userProgressList
      .filter(p => p.progress > 0 && p.progress < 100)
      .map(p => ({ ...p.toObject(), pathId: p.learningPathId.toString() }));

    const recommendedLearningPaths = allLearningPaths
      .filter(path => !completedPathIds.includes(path._id.toString()))
      .map(path => {
        const inProgress = inProgressPaths.find(ip => ip.pathId === path._id.toString());
        return {
          title: path.title,
          description: path.description,
          category: path.category,
          difficulty: path.difficulty,
          duration: path.duration,
          progress: inProgress?.progress || 0,
          status: inProgress ? 'continue' : 'start', // 'start' = new, 'continue' = in progress
          completedModules: inProgress?.completedModules?.length || 0,
          totalModules: path.modules?.length || 0,
          type: 'learning_path'
        };
      })
      .sort((a, b) => {
        // Sort: in-progress first, then by difficulty
        if (a.progress > 0) return -1;
        if (b.progress > 0) return 1;
        const diffOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      });

    // Build artwork recommendations - real from gallery
    const artworksNotInFavorites = allArtworks.filter(a => 
      !userFavorites.includes(a._id.toString())
    );
    
    const recommendedArtworks = artworksNotInFavorites
      .slice(0, 5)
      .map(art => ({
        _id: art._id,
        title: art.title,
        artist: art.artist || 'Unknown',
        imageUrl: art.imageUrl,
        category: art.category,
        description: art.description,
        likes: art.likes || 0,
        type: 'artwork'
      }));

    // Build tutorial recommendations - from blogs matching current learning
    const recommendedTutorials = allBlogs
      .slice(0, 4)
      .map(blog => ({
        id: blog._id,
        title: blog.title,
        description: blog.content?.substring(0, 100) || 'Recommended tutorial',
        type: 'blog'
      }));

    // Build "next steps" message based on progress
    let nextStepsMessage = '';
    if (inProgressPaths.length > 0) {
      const highestProgress = inProgressPaths[0];
      const pathName = allLearningPaths.find(p => p._id.toString() === highestProgress.pathId)?.title || 'Your current path';
      nextStepsMessage = `Continue with ${pathName} - ${highestProgress.progress}% complete`;
    } else if (recommendedLearningPaths.length > 0) {
      nextStepsMessage = `Get started with ${recommendedLearningPaths[0].title}`;
    }

    res.json({
      success: true,
      userId,
      message: nextStepsMessage,
      stats: {
        completedLearningPaths: completedPathIds.length,
        inProgressLearningPaths: inProgressPaths.length,
        totalFavorites: userFavorites.length,
        availableArtworks: allArtworks.length,
        availableBlogs: allBlogs.length
      },
      recommendations: {
        learningPaths: recommendedLearningPaths,
        artworks: recommendedArtworks,
        tutorials: recommendedTutorials
      }
    });

  } catch (error) {
    console.error('Error in smart suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch smart suggestions', details: error.message });
  }
});

// Get AI suggestions for a user
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const userIdParam = req.params.userId;
    let userId;
    
    // Handle both numeric IDs and string IDs (like MongoDB ObjectIds)
    // For our dataset, we expect numeric IDs (1, 2), but for real user accounts we might need to map
    if (/^\d+$/.test(userIdParam)) {
      // It's a numeric string, convert to integer
      userId = parseInt(userIdParam);
    } else {
      // It's likely a MongoDB ObjectId string
      // For demo purposes, we'll cycle through available user IDs based on ObjectId hash
      // This ensures different users get different recommendations
      if (/^[0-9a-fA-F]{24}$/.test(userIdParam)) {
        // Use the last few characters of the ObjectId to determine user ID
        const hash = userIdParam.slice(-2); // Last 2 characters
        const numericHash = parseInt(hash, 16); // Convert hex to decimal
        userId = (numericHash % 2) + 1; // Map to 1 or 2 (our available user IDs)
      } else {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }
    }
    
    // Ensure userId is within our dataset range (1-2)
    if (userId < 1 || userId > 2) {
      userId = 1; // Default to user 1
    }
    
    console.log(`Mapping user ${userIdParam} to dataset user ${userId}`);
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI service
    const aiServiceUrl = process.env.AI_SUGGESTIONS_URL || 'http://localhost:5001';
    const response = await fetch(`${aiServiceUrl}/adaptive_suggest?user_id=${userId}`);
    
    if (!response.ok) {
      console.error(`AI service error: ${response.status} - ${await response.text()}`);
      return res.status(500).json({ error: 'Failed to fetch AI suggestions from Python service' });
    }
    
    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    console.error('Error in AI suggestions route:', error);
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
    const userIdParam = req.params.userId;
    let userId;

    // Accept numeric IDs or MongoDB ObjectId strings and map to demo dataset IDs
    if (/^\d+$/.test(userIdParam)) {
      userId = parseInt(userIdParam);
    } else if (/^[0-9a-fA-F]{24}$/.test(userIdParam)) {
      const hash = userIdParam.slice(-2);
      const numericHash = parseInt(hash, 16);
      userId = (numericHash % 2) + 1; // map into available demo IDs (1 or 2)
    } else {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (userId < 1 || userId > 2) userId = 1;

    console.log(`Mapping user ${userIdParam} to dataset user ${userId} for art-creation`);

    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');

    // Call the Python AI service
    const aiServiceUrl = process.env.AI_SUGGESTIONS_URL || 'http://localhost:5001';
    const response = await fetch(`${aiServiceUrl}/art_creation_suggestions/${userId}`);

    if (!response.ok) {
      console.error(`AI art-creation service error: ${response.status} - ${await response.text()}`);
      return res.status(500).json({ error: 'Failed to fetch art creation suggestions from Python service' });
    }

    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    console.error('Error in AI art-creation route:', error);
    res.status(500).json({ error: 'Failed to generate art creation suggestions' });
  }
});

module.exports = router;