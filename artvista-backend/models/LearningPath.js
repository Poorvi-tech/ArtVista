const mongoose = require('mongoose');

const LearningPathSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    modules: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        lessons: [{
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            duration: {
                type: Number, // in minutes
                required: true
            },
            type: {
                type: String,
                enum: ['video', 'article', 'quiz', 'exercise'],
                required: true
            }
        }],
        estimatedTime: {
            type: Number, // in minutes
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);