from flask import Flask, request, jsonify
import sys
import os

# Add the scripts directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_drag_drop_game import EnhancedDragDropGame

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to ArtVista AI Game API',
        'endpoints': [
            '/start_game',
            '/choose_background/<int:game_id>',
            '/add_element/<int:game_id>',
            '/check_scene/<int:game_id>',
            '/get_suggestions/<int:game_id>',
            '/adjust_difficulty/<int:game_id>',
            '/leaderboard'
        ],
        'method': 'POST for game creation, GET for other endpoints'
    })

# In-memory storage for active games
games = {}

@app.route('/start_game', methods=['POST'])
def start_game():
    """Start a new game session"""
    data = request.json
    if data is None:
        return jsonify({'error': 'JSON data is required'}), 400
    user_name = data.get('user_name')
    user_id = data.get('user_id')
    
    if not user_name:
        return jsonify({'error': 'user_name is required'}), 400
    
    # Create a new game instance
    game = EnhancedDragDropGame(user_name, user_id)
    game_id = len(games) + 1
    games[game_id] = game
    
    return jsonify({
        'game_id': game_id,
        'message': f'Game started for {user_name}',
        'difficulty': game.difficulty,
        'level': game.level
    })

@app.route('/choose_background/<int:game_id>', methods=['POST'])
def choose_background(game_id):
    """Choose a background for the game"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    if data is None:
        return jsonify({'error': 'JSON data is required'}), 400
    background = data.get('background')
    
    if not background:
        return jsonify({'error': 'background is required'}), 400
    
    game = games[game_id]
    result = game.choose_background(background)
    
    return jsonify({
        'message': result,
        'background': game.background
    })

@app.route('/add_element/<int:game_id>', methods=['POST'])
def add_element(game_id):
    """Add an element to the scene"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    if data is None:
        return jsonify({'error': 'JSON data is required'}), 400
    element = data.get('element')
    
    if not element:
        return jsonify({'error': 'element is required'}), 400
    
    game = games[game_id]
    result = game.add_element(element)
    
    return jsonify({
        'message': result,
        'points': game.points,
        'elements': game.elements
    })

@app.route('/check_scene/<int:game_id>', methods=['GET'])
def check_scene(game_id):
    """Check if the scene is complete"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = games[game_id]
    result = game.check_scene()
    
    return jsonify(result)

@app.route('/get_suggestions/<int:game_id>', methods=['GET'])
def get_suggestions(game_id):
    """Get AI-powered suggestions for the next elements"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = games[game_id]
    suggestions = game.get_ai_suggestions()
    
    return jsonify(suggestions)

@app.route('/adjust_difficulty/<int:game_id>', methods=['POST'])
def adjust_difficulty(game_id):
    """AI-powered dynamic difficulty adjustment"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = games[game_id]
    result = game.ai_adjust_difficulty()
    
    return jsonify({
        'message': result,
        'difficulty': game.difficulty,
        'level': game.level
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running"""
    return jsonify({'status': 'healthy', 'message': 'AI Game API is running'})

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get the current leaderboard"""
    # In a real implementation, this would be stored in a database
    # For now, we'll return a mock leaderboard
    mock_leaderboard = [
        {"user": "Aditi", "points": 45},
        {"user": "Rohan", "points": 32},
        {"user": "Priya", "points": 28},
        {"user": "Amit", "points": 21},
        {"user": "Sneha", "points": 17}
    ]
    return jsonify(mock_leaderboard)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)