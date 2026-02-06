const express = require('express');
const router = express.Router();
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');

// Health check/status endpoint
router.get('/status', async (req, res) => {
    try {
        res.json({ status: 'ok', message: 'Learning service is running' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all learning paths (alias for /)
router.get('/paths', async (req, res) => {
    try {
        const learningPaths = await LearningPath.find();
        res.json(learningPaths);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all learning paths
router.get('/', async (req, res) => {
    try {
        const learningPaths = await LearningPath.find();
        res.json(learningPaths);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific learning path
router.get('/:id', async (req, res) => {
    try {
        const learningPath = await LearningPath.findById(req.params.id);
        if (!learningPath) {
            return res.status(404).json({ error: 'Learning path not found' });
        }
        res.json(learningPath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user progress for a learning path
router.get('/progress/:userId/:learningPathId', async (req, res) => {
    try {
        const progress = await UserProgress.findOne({
            userId: req.params.userId,
            learningPathId: req.params.learningPathId
        });
        
        if (!progress) {
            return res.json({
                progress: 0,
                completedModules: [],
                completedLessons: [],
                badges: []
            });
        }
        
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll user in a learning path
router.post('/enroll', async (req, res) => {
    try {
        const { userId, learningPathId } = req.body;
        
        // Check if user is already enrolled
        const existingProgress = await UserProgress.findOne({
            userId,
            learningPathId
        });
        
        if (existingProgress) {
            return res.status(400).json({ message: 'User already enrolled in this learning path' });
        }
        
        // Create new progress record
        const progress = new UserProgress({
            userId,
            learningPathId
        });
        
        await progress.save();
        
        res.json({
            message: 'Successfully enrolled in learning path',
            progress
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark lesson as completed
router.post('/complete-lesson', async (req, res) => {
    try {
        const { userId, learningPathId, moduleId, lessonId, score } = req.body;
        
        let progress = await UserProgress.findOne({
            userId,
            learningPathId
        });
        
        if (!progress) {
            return res.status(404).json({ error: 'User progress not found' });
        }
        
        // Check if lesson is already completed
        const existingLesson = progress.completedLessons.find(
            lesson => lesson.lessonId.toString() === lessonId
        );
        
        if (existingLesson) {
            return res.status(400).json({ message: 'Lesson already completed' });
        }
        
        // Add completed lesson
        progress.completedLessons.push({
            lessonId,
            moduleId,
            score
        });
        
        // Update overall progress
        const learningPath = await LearningPath.findById(learningPathId);
        if (learningPath) {
            // Count total lessons
            let totalLessons = 0;
            learningPath.modules.forEach(module => {
                totalLessons += module.lessons.length;
            });
            
            // Calculate progress percentage
            const completedCount = progress.completedLessons.length;
            progress.progress = Math.round((completedCount / totalLessons) * 100);
            
            // Check if learning path is completed
            if (progress.progress >= 100 && !progress.completedAt) {
                progress.completedAt = new Date();
                
                // Award completion badge
                progress.badges.push({
                    name: `${learningPath.title} Master`
                });
            }
        }
        
        await progress.save();
        
        res.json({
            message: 'Lesson marked as completed',
            progress
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's enrolled learning paths with progress
router.get('/user/:userId', async (req, res) => {
    try {
        const progressRecords = await UserProgress.find({ userId: req.params.userId })
            .populate('learningPathId');
        
        res.json(progressRecords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user progress (alias for getting all user progress)
router.get('/progress/:userId', async (req, res) => {
    try {
        const progressRecords = await UserProgress.find({ userId: req.params.userId })
            .populate('learningPathId');
        
        res.json(progressRecords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;