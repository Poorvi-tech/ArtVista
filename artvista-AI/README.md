# 🤖 ArtVista AI & Game Logic

This folder contains the artificial intelligence and game logic components that power ArtVista's smart features and interactive experiences.

## 📁 Components

### 1. **AI Suggestions** (`ai_suggestions/`)
Intelligent art recommendation and suggestion engine that provides personalized content to users.

#### Features:
- **Personalized Art Recommendations** - ML-based suggestions tailored to user preferences
- **Art Creation Suggestions** - Smart ideas and prompts for creating artwork
- **API Mock Service** - Mock API for testing AI features
- **Dataset** - Training data for art suggestions (`art_suggestions.json`)

#### Key Files:
- `api_mock.py` - Mock API server for suggestion endpoints
- `art_creation_suggestions.py` - Engine for generating creative prompts
- `enhanced_suggestion_engine.py` - Advanced suggestion algorithm

#### Usage:
```bash
cd ai_suggestions/scripts
python api_mock.py
```

### 2. **Game Logic** (`game_logic/`)
Interactive educational games engine that powers ArtVista's games hub.

#### Features:
- **Drag & Drop Games** - Interactive drag-and-drop game mechanics
- **Puzzle Rules** - Game rule engine and validation
- **Game API** - Backend service for game operations
- **Enhanced Game System** - Advanced game features and scoring

#### Key Files:
- `drag_drop_game.py` - Base drag-and-drop game implementation
- `enhanced_drag_drop_game.py` - Enhanced version with advanced features
- `game_api.py` - Flask API for game operations
- `puzzle_rules.py` - Game rules and validation logic

#### Games Available:
- Memory Match
- Color Mixing
- Spot the Difference

#### Usage:
```bash
cd game_logic/scripts
python game_api.py
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Flask (for API services)
- numpy, pandas (for AI processing)

### Installation

```bash
# Navigate to AI folder
cd artvista-AI

# Install AI dependencies
cd ai_suggestions
pip install -r requirements.txt

# Install Game Logic dependencies  
cd ../game_logic
pip install -r requirements.txt
```

### Running Services

**AI Suggestion Service:**
```bash
cd ai_suggestions/scripts
python api_mock.py
# Server runs on http://localhost:5001
```

**Game Logic Service:**
```bash
cd game_logic/scripts
python game_api.py
# Server runs on http://localhost:5002
```

## 🔌 Integration Points

### Backend Communication
- Backend calls AI service at: `http://localhost:5001/suggest`
- Backend calls Game service at: `http://localhost:5002/start_game`
- Both services return JSON responses

### Frontend Integration
- Frontend games are managed through `GamesHub.js` component
- AI recommendations displayed in `AIRecommendations.js` component
- Art creation suggestions shown in `ArtCreationSuggestions.js` component

## 📊 Data Flow

```
User -> Frontend -> Backend -> Python Services (AI/Games)
                      |
                      v
                  Database (MongoDB)
```

## 🎮 Game Features

- **User Scoring** - Track player performance
- **Leaderboard Integration** - Global rankings
- **Difficulty Levels** - Adjustable game difficulty
- **Progress Tracking** - Save user game progress

## 🤖 AI Features

- **Preference Learning** - Learns from user interactions
- **Recommendation Engine** - Suggests artwork and ideas
- **Creative Prompts** - Generates art creation suggestions
- **Pattern Recognition** - Identifies art styles and preferences

## 📝 Documentation

Detailed documentation for each component:
- [AI Suggestions Docs](./ai_suggestions/docs)
- [Game Logic Docs](./game_logic/docs)

## 🔧 Development

For local development and testing:

```bash
# Test AI service
python ai_suggestions/scripts/api_mock.py

# Test Game service
python game_logic/scripts/game_api.py

# Run with debug mode
python -m flask run --debug
```

## 📚 Dataset

Art suggestion training data located in: `ai_suggestions/dataset/art_suggestions.json`

## 🤝 Contributing

Both AI and game logic components follow Python best practices:
- Use virtual environments for isolation
- Include docstrings for all functions
- Write unit tests for new features
- Follow PEP 8 style guidelines

## 📄 License

Part of the ArtVista project. See main README for details.
