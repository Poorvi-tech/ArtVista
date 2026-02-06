const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    learningPathId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningPath',
        required: true
    },
    progress: {
        type: Number,
        default: 0, // percentage
        min: 0,
        max: 100
    },
    completedModules: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    completedLessons: [{
        lessonId: {
            type: mongoose.Schema.Types.ObjectId
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number // for quizzes
        }
    }],
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    badges: [{
        name: {
            type: String
        },
        awardedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);