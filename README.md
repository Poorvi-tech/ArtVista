# ArtVista 🎨

An interactive, AI-powered web platform for art enthusiasts, creators, and learners. ArtVista combines educational games, art creation tools, community features, and AI-driven recommendations to create an engaging ecosystem for exploring and learning art.

## 🔗 Live Demo

- **Website**: [ArtVista (Live)](https://art-vista-five.vercel.app/)

## 🌟 Features

### Core Features
- **AI Recommendations** - Personalized artwork/tutorial suggestions (powered by the Python AI service)
- **Art Creation Suggestions** - Step-by-step creative prompts, palettes, and techniques
- **Art Gallery** - Browse artworks, filter by category, and upload new artwork
- **Games Hub (10 levels)** - Educational games + score tracking + leaderboard
- **Blogs & Tutorials** - Blog list + blog details
- **Learning Paths** - Curated learning paths with quick-start resources
- **Virtual Exhibition** - Featured/curated exhibition experience
- **Community Feed** - Social/community feed experience
- **Profiles** - User profile page and progress tracking
- **Shop + Cart + Checkout** - Basic e-commerce flow (protected)

### Advanced Features
- **Authentication** - Protected pages for premium features (Shop, Checkout, Games, Leaderboard, Exhibition, Art Creator, Community, Learning)
- **Leaderboard (Realtime)** - Score leaderboard with trends + live updates (SSE)
- **AI Scene Creator (Python-governed)** - Drag-and-drop scene building with AI suggestions via backend proxy

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
└── artvista-AI/             # Python AI/ML & Game Logic
    ├── ai_suggestions/      # AI recommendation engine
    │   ├── scripts/         # AI suggestion engines
    │   ├── dataset/         # Training data
    │   └── docs/            # AI documentation
    └── game_logic/          # Game logic & rules engine
        ├── scripts/         # Game engines and APIs
        ├── sketches/        # Game design sketches
        └── docs/            # Game documentation
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
- **AI Suggestions** - Personalized art recommendation engine
- **Game Logic** - Interactive game rules and mechanics
- **JSON** - Data format for suggestions and game data

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
git clone <your-repo-url>
cd ArtVista
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

Create a `.env` file in `artvista-backend/`.
Use `artvista-backend/.env.example` as the template (recommended), or at minimum set:

```
MONGO_URI=mongodb://localhost:27017/artvista
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
AI_SUGGESTIONS_URL=http://localhost:5001
AI_GAME_URL=http://localhost:5002
```

Start the backend:
```bash
npm start
```
The backend will run on `http://localhost:5000`

#### 4. AI Services Setup
```bash
cd artvista-AI/ai_suggestions
pip install -r requirements.txt
python scripts/api_mock.py
```
The AI API will run on `http://localhost:5001`

To run the game logic API:

```bash
cd artvista-AI/game_logic
pip install -r requirements.txt
python scripts/game_api.py
```

The game API will run on `http://localhost:5002`

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
- `GET /` - Get all artworks
- `GET /category/:category` - Get artworks by category
- `POST /upload` - Upload a new artwork

### Game Routes (`/api/game`)
- `GET /games` - Get games list
- `POST /submit` - Submit game score (auth required)
- `GET /leaderboard` - Leaderboard (top N via `?limit=10`)
- `GET /leaderboard/trends` - Leaderboard trend series
- `GET /leaderboard/stream` - Live leaderboard updates (SSE)
- `POST /scene-creator/start` - Start AI Scene Creator session (proxy to Python game service)
- `POST /scene-creator/choose_background/:gameId` - Choose background (proxy)
- `POST /scene-creator/add_element/:gameId` - Add element (proxy)
- `GET /scene-creator/check_scene/:gameId` - Check scene (proxy)
- `GET /scene-creator/get_suggestions/:gameId` - Get AI suggestions (proxy)

### Blog Routes (`/api/blog`)
- `GET /posts` - Get all blog posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post

### Learning Routes (`/api/learning`)
- `GET /paths` - Get learning paths
- `GET /paths/:id` - Get path details

### AI Routes (`/api/ai`)
- `POST /chat` - ArtVista Virtual Professor chat (supports SSE streaming)
- `GET /suggestions/:userId` - Personalized recommendations (proxy to Python AI service)
- `GET /art-creation/:userId` - Art creation suggestions (proxy to Python AI service)
- `GET /smart-suggestions/:userId` - Smart suggestions using MongoDB data + user progress
- `POST /interaction/artwork` - Record artwork interaction (analytics hook)
- `POST /interaction/tutorial` - Record tutorial interaction (analytics hook)

## 🎮 Available Games

- **Memory Match** - Classic matching card game
- **Color Mixing** - Learn color theory
- **Art History Quiz** - Test knowledge of famous artists, movements, and masterpieces
- **AI Scene Creator** - Drag-and-drop scene creation with AI guidance (via Python service)

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
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
NODE_ENV=development
PORT=5000
AI_SUGGESTIONS_URL=http://localhost:5001
AI_GAME_URL=http://localhost:5002
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_SUGGESTIONS_URL=http://localhost:5001
REACT_APP_AI_GAME_URL=http://localhost:5002
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## 🌐 Deployment

- **Frontend (Vercel)**: deployed at [ArtVista (Live)](https://art-vista-five.vercel.app/)
- **Backend (Render)**: set `REACT_APP_BACKEND_URL` in the frontend to your backend URL (example: `https://artvistabackend.onrender.com`)
- **AI services (Render)**: set `REACT_APP_AI_SUGGESTIONS_URL` and `REACT_APP_AI_GAME_URL` (examples: `https://artvistasuggestions.onrender.com`, `https://artvistagame.onrender.com`)

## 🔐 Security note

- Never commit real secrets to GitHub. If any secrets were committed previously, rotate them (MongoDB users/passwords, JWT secret, Stripe key, etc.) and remove them from git history if needed.

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
