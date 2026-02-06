import json
import random
import os
from collections import defaultdict
from datetime import datetime, timedelta

# Load dataset with absolute path
script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_dir, "../dataset/art_suggestions.json")
with open(dataset_path, "r") as f:
    data = json.load(f)

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

def enhanced_adaptive_suggestions(user_id):
    """Enhanced recommendation system combining multiple approaches"""
    user = next(u for u in data["users"] if u["id"] == user_id)
    
    # Get collaborative filtering recommendations
    collab_recs = collaborative_filtering(user_id)
    
    # Get content-based filtering recommendations
    content_artworks, content_tutorials = content_based_filtering(user_id)
    
    # Get trending recommendations
    trending_artworks, trending_tutorials = trending_recommendations()
    
    # Combine all recommendations with weights
    # Content-based: 40%, Collaborative: 30%, Trending: 30%
    
    # Get user's already interacted items
    clicked = set(user.get("interactions", {}).get("clicked_artworks", []))
    completed = set(user.get("interactions", {}).get("completed_tutorials", []))
    
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

# Example usage
if __name__ == "__main__":
    print("Enhanced Adaptive Suggestions for Aditi:")
    print(json.dumps(enhanced_adaptive_suggestions(1), indent=2))
    
    print("\nEnhanced Adaptive Suggestions for Rohan:")
    print(json.dumps(enhanced_adaptive_suggestions(2), indent=2))