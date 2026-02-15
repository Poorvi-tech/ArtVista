const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

// Get user progress for a learning path (by ID or by path ID string)
router.get('/progress/:userId/:learningPathId', async (req, res) => {
    try {
        const { userId, learningPathId } = req.params;
        
        // Handle both numeric IDs and string IDs
        const query = { userId };
        
        // Try to convert to ObjectId if it looks like one
        if (mongoose.Types.ObjectId.isValid(learningPathId)) {
            query.learningPathId = new mongoose.Types.ObjectId(learningPathId);
        } else {
            query.learningPathId = learningPathId;
        }
        
        const progress = await UserProgress.findOne(query).populate('learningPathId');
        
        if (!progress) {
            return res.json({
                success: true,
                progress: 0,
                completedModules: [],
                completedLessons: [],
                badges: [],
                isEnrolled: false
            });
        }
        
        // Calculate actual progress
        const path = await LearningPath.findById(progress.learningPathId._id);
        let totalLessons = 0;
        if (path && path.modules) {
            path.modules.forEach(module => {
                totalLessons += (module.lessons ? module.lessons.length : 0);
            });
        }
        
        const completedLessonsCount = progress.completedLessons ? progress.completedLessons.length : 0;
        const calculatedProgress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
        
        res.json({
            success: true,
            _id: progress._id,
            progress: Math.max(progress.progress, calculatedProgress), // Use the max value
            completedModules: progress.completedModules || [],
            completedLessons: progress.completedLessons || [],
            badges: progress.badges || [],
            isEnrolled: true,
            completedAt: progress.completedAt
        });
    } catch (err) {
        console.error('Error fetching progress:', err);
        res.status(500).json({ error: err.message });
    }
});

// Enroll user in a learning path - REAL-TIME
router.post('/enroll', async (req, res) => {
    try {
        const { userId, learningPathId } = req.body;
        
        if (!userId || !learningPathId) {
            return res.status(400).json({ error: 'userId and learningPathId are required' });
        }
        
        // Resolve learning path: accept ObjectId or numeric/mock id from frontend
        let path = null;
        if (mongoose.Types.ObjectId.isValid(learningPathId)) {
            path = await LearningPath.findById(learningPathId);
        }
        // If not found yet, try to match by a numeric or custom `id` field (mock data uses numeric ids)
        if (!path) {
            path = await LearningPath.findOne({ $or: [ { id: learningPathId }, { slug: learningPathId } ] });
        }
        // If still not found, try a direct lookup (safely) in case the value is string but stored as ObjectId-like
        if (!path && typeof learningPathId === 'string') {
            try {
                path = await LearningPath.findById(learningPathId);
            } catch (e) {
                // ignore casting errors
            }
        }

        if (!path) {
            return res.status(404).json({ error: 'Learning path not found' });
        }

        const pathId = path._id;

        // Check if user is already enrolled (use resolved ObjectId)
        const existingProgress = await UserProgress.findOne({
            userId,
            learningPathId: pathId
        });

        if (existingProgress) {
            return res.json({ 
                success: false,
                message: 'User already enrolled in this learning path',
                progress: existingProgress
            });
        }
        
        // Create new progress record
        const progress = new UserProgress({
            userId,
            learningPathId: pathId,
            progress: 0,
            completedModules: [],
            completedLessons: [],
            badges: [],
            enrolledAt: new Date()
        });
        
        await progress.save();
        
        res.json({
            success: true,
            message: 'Successfully enrolled in learning path',
            progress: progress
        });
    } catch (err) {
        console.error('Enrollment error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Mark lesson as completed - REAL-TIME UPDATE
router.post('/complete-lesson', async (req, res) => {
    try {
        const { userId, learningPathId, moduleId, lessonId, score } = req.body;
        
        if (!userId || !learningPathId || !lessonId) {
            return res.status(400).json({ error: 'userId, learningPathId, and lessonId are required' });
        }
        
        // Convert to ObjectId if needed
        let pathId = learningPathId;
        if (mongoose.Types.ObjectId.isValid(learningPathId)) {
            pathId = new mongoose.Types.ObjectId(learningPathId);
        }
        
        let progress = await UserProgress.findOne({
            userId,
            learningPathId: pathId
        });
        
        if (!progress) {
            return res.status(404).json({ error: 'User not enrolled in this learning path' });
        }
        
        // Check if lesson is already completed
        const isAlreadyCompleted = progress.completedLessons && progress.completedLessons.some(
            lesson => lesson.lessonId?.toString() === lessonId?.toString()
        );
        
        if (isAlreadyCompleted) {
            return res.json({ 
                success: false,
                message: 'Lesson already completed',
                progress: progress
            });
        }
        
        // Add completed lesson
        if (!progress.completedLessons) {
            progress.completedLessons = [];
        }
        
        progress.completedLessons.push({
            lessonId: lessonId,
            moduleId: moduleId || null,
            score: score || null,
            completedAt: new Date()
        });
        
        // Update overall progress
        const learningPath = await LearningPath.findById(pathId);
        if (learningPath && learningPath.modules) {
            // Count total lessons
            let totalLessons = 0;
            learningPath.modules.forEach(module => {
                totalLessons += (module.lessons ? module.lessons.length : 0);
            });
            
            // Calculate progress percentage
            const completedCount = progress.completedLessons.length;
            progress.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            
            // Check if learning path is completed
            if (progress.progress >= 100 && !progress.completedAt) {
                progress.completedAt = new Date();
                
                // Award completion badge
                if (!progress.badges) {
                    progress.badges = [];
                }
                progress.badges.push({
                    name: `${learningPath.title} Master`,
                    awardedAt: new Date()
                });
            }
        }
        
        await progress.save();
        
        res.json({
            success: true,
            message: 'Lesson marked as completed',
            progress: {
                _id: progress._id,
                progress: progress.progress,
                completedLessons: progress.completedLessons,
                completedAt: progress.completedAt,
                badges: progress.badges
            }
        });
    } catch (err) {
        console.error('Error completing lesson:', err);
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