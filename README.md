# ArtVista 🎨

An interactive, AI-powered web platform for art enthusiasts, creators, and learners. ArtVista combines educational games, art creation tools, community features, and AI-driven recommendations to create an engaging ecosystem for exploring and learning art.

## 🌟 Features

### Core Features
- **AI-Powered Recommendations** - Personalized art suggestions based on user preferences and behavior
- **Art Gallery** - Browse and discover curated artwork collections
- **Art Creator** - Tools and suggestions for creating your own artwork
- **Interactive Games** - Educational games like Memory Match, Color Mixing, Spot the Difference
- **Blog & Articles** - Learning resources and art discussions
- **E-Commerce** - Shop for art supplies and prints
- **Social Features** - Community feed, comments, and user interactions
- **Learning Paths** - Structured courses for art education
- **User Profiles** - Track progress, achievements, and learning history
- **Admin Dashboard** - Content and user management

### Advanced Features
- **Leaderboards** - Gamified learning with rankings
- **AI Art Suggestions** - Smart recommendations for art creation
- **Exhibition Management** - Organize and showcase virtual exhibitions
- **Cart & Checkout** - Complete e-commerce functionality
- **Authentication** - Secure user registration and login

## 🏗️ Project Structure

```
ArtVista/
├── artvista-frontend/       # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API for state management
│   │   ├── services/        # API and Firebase services
│   │   └── assets/          # Images and static assets
│   └── public/              # Static files
│
├── artvista-backend/        # Node.js/Express backend server
│   ├── routes/              # API endpoints
│   ├── models/              # MongoDB data models
│   │   ├── User.js
│   │   ├── Artwork.js
│   │   ├── Blog.js
│   │   ├── Game.js
│   │   ├── LearningPath.js
│   │   ├── Order.js
│   │   ├── Comment.js
│   │   ├── Social.js
│   │   └── UserProgress.js
│   └── server.js            # Express app setup
│
└── artvista-AI/             # Python AI/ML components
    └── ai_suggestions/
        ├── scripts/         # AI suggestion engines
        ├── dataset/         # Training data
        └── docs/            # Research documentation
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Craco** - Create React App configuration
- **Context API** - State management
- **Firebase** - Authentication and backend services
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### AI/ML
- **Python** - Programming language
- **Flask** - Web framework for ML APIs
- **JSON** - Data format for suggestions

### DevOps & Tools
- **npm** - Package management
- **Git** - Version control
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)
- Python 3.7+ (for AI services)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/artvista.git
cd artvista
```

#### 2. Frontend Setup
```bash
cd artvista-frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

#### 3. Backend Setup
```bash
cd artvista-backend
npm install
```

Create a `.env` file in `artvista-backend/`:
```
MONGO_URI=mongodb://localhost:27017/artvista
PORT=5000
NODE_ENV=development
```

Start the backend:
```bash
npm start
```
The backend will run on `http://localhost:5000`

#### 4. AI Services Setup
```bash
cd artvista-AI/ai_suggestions
pip install flask
python scripts/api_mock.py
```
The AI API will run on `http://localhost:5001`

## 📋 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /progress` - Get learning progress

### Gallery Routes (`/api/gallery`)
- `GET /artworks` - Get all artworks
- `GET /artworks/:id` - Get single artwork
- `POST /artworks` - Create new artwork

### Game Routes (`/api/game`)
- `GET /games` - Get all games
- `POST /games/:gameId/score` - Submit game score

### Blog Routes (`/api/blog`)
- `GET /posts` - Get all blog posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post

### Learning Routes (`/api/learning`)
- `GET /paths` - Get learning paths
- `GET /paths/:id` - Get path details

### AI Routes (`/api/ai`)
- `GET /suggestions/:userId` - Get AI recommendations
- `GET /art-suggestions/:userId` - Get art creation suggestions

## 🎮 Available Games

- **Memory Match** - Classic matching card game
- **Spot the Difference** - Find differences between images
- **Color Mixing** - Learn color theory
- **Art Quiz** - Test art knowledge

## 👥 User Roles

- **Guest** - Browse gallery and read blog
- **User** - Access all features except admin
- **Admin** - Manage content and user accounts

## 🔐 Security Features

- Environment variable protection (`.env` files ignored in git)
- MongoDB connection security
- CORS enabled for trusted origins
- User authentication via Firebase/JWT

## 📚 File Structure Details

### Core Models
- **User** - User account information
- **Artwork** - Art submissions and gallery items
- **Blog** - Blog posts and articles
- **Game** - Game configurations and scores
- **LearningPath** - Course structures
- **Order** - E-commerce orders
- **Comment** - User comments on content
- **Social** - User likes and follows
- **UserProgress** - Learning and game progress tracking

## 🤖 AI Features

The AI module provides:
- **Adaptive Suggestions** - Personalized recommendations based on user behavior
- **Art Creation Suggestions** - AI-guided suggestions for artists
- **Collaborative Filtering** - User similarity-based recommendations

## 🐛 Debugging

Enable Morgan logging in backend to track HTTP requests:
```javascript
app.use(morgan('dev'));
```

Check MongoDB connection with:
```bash
mongosh
use artvista
db.users.find()
```

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
FIREBASE_API_KEY=your_firebase_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer Notes

- Frontend runs on port 3000
- Backend runs on port 5000
- AI API runs on port 5001
- Ensure all services are running for full functionality
- Use MongoDB local instance or cloud MongoDB Atlas
- Check `.gitignore` files for security-sensitive files

## 🎯 Future Enhancements

- [ ] Social authentication (Google, GitHub)
- [ ] Real-time collaboration on art projects
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] AR/VR art experiences
- [ ] WebSocket support for real-time features

## 💬 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation in `/docs` folders
- Review research notes in `artvista-AI/ai_suggestions/docs/`

---

**Made with ❤️ for the art community**
