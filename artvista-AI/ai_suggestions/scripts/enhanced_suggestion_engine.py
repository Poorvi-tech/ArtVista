import json
import random
import os
from collections import defaultdict
from datetime import datetime, timedelta
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini AI (if key is present)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

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
        if os.path.exists(dataset_path):
            with open(dataset_path, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"Dataset load error: {e}")
    
    # Fallback to a rich minimal dataset for deployment
    return {
        "users": [
            {"id": 1, "name": "Aditi", "preferences": ["landscape", "watercolor", "nature"], "interactions": {"clicked_artworks": [], "completed_tutorials": []}},
            {"id": 2, "name": "Rohan", "preferences": ["urban", "abstract", "oil"], "interactions": {"clicked_artworks": [], "completed_tutorials": []}}
        ],
        "artworks": [
            {"id": "A1", "title": "Sunset Valley", "style": "landscape", "medium": "watercolor", "artist": "Aditi Rao", "image": "https://images.unsplash.com/photo-1579783902614-a3f140026229?w=500&q=80", "description": "A tranquil valley at sunset."},
            {"id": "A2", "title": "City Rush", "style": "urban", "medium": "oil", "artist": "Rohan Sharma", "image": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80", "description": "The vibrant energy of a metropolis."},
            {"id": "A3", "title": "Dream Shapes", "style": "abstract", "medium": "digital", "artist": "Priya Singh", "image": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80", "description": "An ethereal abstract composition."}
        ],
        "tutorials": [
            {"id": "T1", "title": "How to paint landscapes with watercolor", "style": "landscape", "description": "Master the basics of outdoor painting.", "duration": "20 min", "level": "Beginner"},
            {"id": "T2", "title": "Urban sketching for beginners", "style": "urban", "description": "Capture the city in your sketchbook.", "duration": "15 min", "level": "Beginner"},
            {"id": "T3", "title": "Abstract art basics", "style": "abstract", "description": "Explore the world of non-representational art.", "duration": "25 min", "level": "Intermediate"}
        ]
    }

# Load dataset when module is imported
data = load_dataset()

def calculate_user_similarity(user1, user2):
    """Calculate similarity between two users based on preferences"""
    prefs1 = set(user1["preferences"])
    prefs2 = set(user2["preferences"])
    
    # Jaccard similarity
    intersection = len(prefs1.intersection(prefs2))
    union = len(prefs1.union(prefs2))
    
    if union == 0:
        return 0
    
    return intersection / union

def collaborative_filtering(user_id, k=3):
    """Find k similar users and recommend items they liked"""
    target_user = next(u for u in data["users"] if u["id"] == user_id)
    similarities = []
    
    # Calculate similarity with all other users
    for user in data["users"]:
        if user["id"] != user_id:
            similarity = calculate_user_similarity(target_user, user)
            similarities.append((user["id"], similarity))
    
    # Sort by similarity and get top k
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_users = [user_id for user_id, _ in similarities[:k]]
    
    # Get items liked by similar users
    recommendations = []
    for user in data["users"]:
        if user["id"] in top_users:
            clicked = user.get("interactions", {}).get("clicked_artworks", [])
            completed = user.get("interactions", {}).get("completed_tutorials", [])
            
            # Add these items to recommendations
            for artwork in data["artworks"]:
                if artwork["id"] in clicked and artwork not in recommendations:
                    recommendations.append(artwork)
            
            for tutorial in data["tutorials"]:
                if tutorial["id"] in completed and tutorial not in recommendations:
                    recommendations.append(tutorial)
    
    return recommendations

def content_based_filtering(user_id):
    """Recommend items based on user's past preferences"""
    user = next(u for u in data["users"] if u["id"] == user_id)
    prefs = set(user["preferences"])
    
    # Score artworks and tutorials based on preference match
    scored_artworks = []
    scored_tutorials = []
    
    for artwork in data["artworks"]:
        score = 0
        if artwork["style"] in prefs:
            score += 2
        if artwork["medium"] in prefs:
            score += 1
            
        if score > 0:
            scored_artworks.append((artwork, score))
    
    for tutorial in data["tutorials"]:
        score = 0
        if tutorial["style"] in prefs:
            score += 2
            
        if score > 0:
            scored_tutorials.append((tutorial, score))
    
    # Sort by score
    scored_artworks.sort(key=lambda x: x[1], reverse=True)
    scored_tutorials.sort(key=lambda x: x[1], reverse=True)
    
    return [artwork for artwork, _ in scored_artworks], [tutorial for tutorial, _ in scored_tutorials]

def trending_recommendations():
    """Recommend currently trending items"""
    # In a real implementation, this would use actual interaction data
    # For now, we'll randomly select some items as "trending"
    trending_artworks = random.sample(data["artworks"], min(3, len(data["artworks"])))
    trending_tutorials = random.sample(data["tutorials"], min(2, len(data["tutorials"])))
    
    return trending_artworks, trending_tutorials

def adaptive_suggestions(user_id):
    """Enhanced recommendation system combining multiple approaches"""
    try:
        user = next(u for u in data["users"] if u["id"] == user_id)
        user_preferences = user["preferences"]
    except StopIteration:
        user_preferences = ["landscape", "watercolor"]
    
    # Try using Gemini AI if configured
    if model:
        try:
            prompt = f"""
            You are an art recommendation engine.
            The user likes these styles/mediums: {", ".join(user_preferences)}.
            Generate highly personalized recommendations for this user.
            Return strictly a JSON object exactly matching this structure:
            {{
                "artworks": [
                    {{"id": "gen1", "title": "Artwork Title", "artist": "Artist Name", "style": "Style", "medium": "Medium", "description": "Short description", "image": "https://images.unsplash.com/photo-1579783902614-a3f140026229?w=500&q=80"}}
                ],
                "tutorials": [
                    {{"id": "tut1", "title": "Tutorial Title", "style": "Style", "description": "Short description", "duration": "15 min", "level": "Beginner/Intermediate/Advanced"}}
                ]
            }}
            Provide exactly 5 artworks and 3 tutorials. Do not include markdown formatting like ```json.
            Make the image URLs pointing to realistic unsplash photos of art.
            """
            response = model.generate_content(prompt)
            # Parse the JSON response robustly
            text = response.text.strip()
            
            # Extract JSON if wrapped in code blocks
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0]
            elif '```' in text:
                text = text.split('```')[1].split('```')[0]
                
            result = json.loads(text.strip())
            # Ensure keys exist
            if "artworks" not in result: result["artworks"] = []
            if "tutorials" not in result: result["tutorials"] = []
            
            return result
        except Exception as e:
            print(f"Gemini AI error: {e}. Falling back to default recommendation engine.")
    
    # Get collaborative filtering recommendations
    collab_recs = collaborative_filtering(user_id)
    
    # Get content-based filtering recommendations
    content_artworks, content_tutorials = content_based_filtering(user_id)
    
    # Get trending recommendations
    trending_artworks, trending_tutorials = trending_recommendations()
    
    # Combine all recommendations with weights
    # Content-based: 40%, Collaborative: 30%, Trending: 30%
    
    # Get user's already interacted items
    try:
        user = next(u for u in data["users"] if u["id"] == user_id)
        clicked = set(user.get("interactions", {}).get("clicked_artworks", []))
        completed = set(user.get("interactions", {}).get("completed_tutorials", []))
    except StopIteration:
        clicked = set()
        completed = set()
    
    # Filter out already interacted items
    final_artworks = []
    final_tutorials = []
    
    # Add content-based recommendations (weighted more heavily)
    for artwork in content_artworks:
        if artwork["id"] not in clicked and artwork not in final_artworks:
            final_artworks.append(artwork)
    
    # Add some collaborative filtering recommendations
    for item in collab_recs:
        if "style" in item:  # It's an artwork
            if item["id"] not in clicked and item not in final_artworks:
                final_artworks.append(item)
        else:  # It's a tutorial
            if item["id"] not in completed and item not in final_tutorials:
                final_tutorials.append(item)
    
    # Add some trending recommendations
    for artwork in trending_artworks:
        if artwork["id"] not in clicked and artwork not in final_artworks:
            final_artworks.append(artwork)
    
    for tutorial in trending_tutorials:
        if tutorial["id"] not in completed and tutorial not in final_tutorials:
            final_tutorials.append(tutorial)
    
    # Limit results
    final_artworks = final_artworks[:5]
    final_tutorials = final_tutorials[:3]
    
    return {"artworks": final_artworks, "tutorials": final_tutorials}

def get_art_chat_response(message, history=None):
    """Generate a chat response using Gemini with an Art Expert persona"""
    if not model:
        return {
            "response": "I'm currently in offline mode, but I can still tell you that art is the window to the soul! To have a real conversation, please ensure the GEMINI_API_KEY is configured.",
            "status": "offline"
        }
    
    try:
        # Construct the context/persona
        system_prompt = """
        You are the 'ArtVista Virtual Professor', a world-class expert in art history, techniques, and criticism.
        Your goal is to provide deeply satisfying, educational, and inspiring answers about art.
        
        Guidelines for your persona:
        1. Tone: Professional, passionate, and encouraging.
        2. Depth: Provide comprehensive explanations. Don't just give facts; explain the 'why' and 'how'. For example, if asked about a style, discuss its historical context, key characteristics, and famous masters.
        3. Structure: Use clear, readable paragraphs. If explaining a technique, you can use step-by-step logic.
        4. Focus: Stay strictly on the topic of art (history, creation, theory, artists). If the user drifts off-topic, gracefully bring them back to the beauty of art.
        5. Engagement: Occasionally ask the user a follow-up question to encourage their own artistic curiosity.
        """
        
        # In a more advanced version, we would use the history here
        full_prompt = f"{system_prompt}\n\nUser: {message}\nAssistant:"
        
        response = model.generate_content(full_prompt)
        return {
            "response": response.text.strip(),
            "status": "online"
        }
    except Exception as e:
        print(f"Chat error: {e}")
        return {
            "response": "I'm sorry, I'm having a bit of trouble connecting to my creative database right now. Let's talk about art again in a moment!",
            "status": "error"
        }

# Example usage
if __name__ == "__main__":
    print("Enhanced Adaptive Suggestions for Aditi:")
    print(json.dumps(adaptive_suggestions(1), indent=2))
    
    print("\nEnhanced Adaptive Suggestions for Rohan:")
    print(json.dumps(adaptive_suggestions(2), indent=2))