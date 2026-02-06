const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan('dev'));

const gameRoutes = require('./routes/game');
const galleryRoutes = require('./routes/gallery');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const checkoutRoutes = require('./routes/checkout');
const exhibitionRoutes = require('./routes/exhibition');
const artCreatorRoutes = require('./routes/artcreator');
const profileRoutes = require('./routes/profile');
const socialRoutes = require('./routes/social');
const learningRoutes = require('./routes/learning');
const aiRoutes = require('./routes/ai');

app.use('/api/checkout', checkoutRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/exhibition', exhibitionRoutes);
app.use('/api/artcreator', artCreatorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/ai', aiRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Centralized error handling (after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
