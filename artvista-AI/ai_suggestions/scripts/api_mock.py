from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sys
import os

# Add the scripts directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_suggestion_engine import adaptive_suggestions
from art_creation_suggestions import art_creation_suggestions

def load_dataset():
    """Load the art suggestions dataset with fallback for deployment environments"""
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, "../dataset/art_suggestions.json")
    
    # If that doesn't work, try alternative path for deployment
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(script_dir, "..", "..", "artvista-AI", "ai_suggestions", "dataset", "art_suggestions.json")
    
    # Handle case where file might not exist (for deployment safety)
    try:
        with open(dataset_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback to a minimal dataset for deployment
        return {
            "users": [],
            "art_elements": [],
            "art_styles": [],
            "art_periods": [],
            "artists": [],
            "color_palettes": []
        }

# Load dataset when module is imported
data = load_dataset()

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to ArtVista AI Suggestions API',
        'endpoints': [
            '/adaptive_suggest?user_id=<user_id>',
            '/art_creation_suggestions/<user_id>'
        ],
        'method': 'GET'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running"""
    return jsonify({'status': 'healthy', 'message': 'AI Suggestions API is running'})

@app.route("/adaptive_suggest", methods=["GET"])
def suggest():
    user_id_str = request.args.get("user_id")
    if user_id_str is None:
        return jsonify({"error": "user_id is required"}), 400
    user_id = int(user_id_str)
    result = adaptive_suggestions(user_id)
    return jsonify(result)

@app.route("/art_creation_suggestions/<int:user_id>", methods=["GET"])
def get_art_creation_suggestions(user_id):
    result = art_creation_suggestions(user_id)
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)