from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sys
import os

# Add the scripts directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_suggestion_engine import adaptive_suggestions
from art_creation_suggestions import art_creation_suggestions

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Dataset load karo - use absolute path
script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_dir, "../dataset/art_suggestions.json")
with open(dataset_path, "r") as f:
    data = json.load(f)

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