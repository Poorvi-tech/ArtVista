import json
import random
from collections import defaultdict

# Load dataset (in a real implementation, this would be more complex)
with open("../../ai_suggestions/dataset/art_suggestions.json", "r") as f:
    data = json.load(f)

class EnhancedDragDropGame:
    def __init__(self, user_name, user_id=None):
        self.user_name = user_name
        self.user_id = user_id
        self.background = None
        self.elements = []
        self.points = 0
        self.badges = []
        self.level = 1
        self.difficulty = "beginner"  # beginner, intermediate, expert
        self.completed_scenes = 0
        
        # AI-powered difficulty adjustment
        if user_id:
            self._adjust_difficulty_based_on_user()

    def _adjust_difficulty_based_on_user(self):
        """Adjust difficulty based on user's past performance"""
        # In a real implementation, this would use actual user data
        # For now, we'll simulate based on user ID
        if self.user_id == 1:
            self.difficulty = "beginner"
        elif self.user_id == 2:
            self.difficulty = "intermediate"
        else:
            self.difficulty = "beginner"

    def choose_background(self, bg):
        """Select a background for the scene"""
        self.background = bg
        return f"Background set to {bg}"

    def add_element(self, element):
        """Add an element to the scene with point values based on difficulty"""
        self.elements.append(element)
        
        # Base points
        element_points = {
            "Tree": 5, "River": 5, "House": 10, "Sun": 2,
            "Mountain": 8, "Cloud": 3, "Flower": 4, "Bird": 6,
            "Bridge": 12, "Boat": 9, "Castle": 15, "Star": 7
        }
        
        # Adjust points based on difficulty
        base_points = element_points.get(element, 0)
        if self.difficulty == "intermediate":
            points = base_points * 1.2
        elif self.difficulty == "expert":
            points = base_points * 1.5
        else:  # beginner
            points = base_points
            
        self.points += int(points)
        return f"Added {element} (+{int(points)} points)"

    def check_scene(self):
        """Check if the scene is complete and award badges"""
        required_elements = self._get_required_elements()
        
        if len(self.elements) >= required_elements:
            self.completed_scenes += 1
            self._level_up()
            self.award_badge()
            return {
                "status": "completed",
                "message": f"Scene created! Total points: {self.points}, Badges: {self.badges}",
                "points": self.points,
                "badges": self.badges,
                "level": self.level
            }
        else:
            needed = required_elements - len(self.elements)
            return {
                "status": "incomplete",
                "message": f"Add {needed} more elements to complete the scene.",
                "points": self.points,
                "badges": self.badges,
                "level": self.level
            }

    def _get_required_elements(self):
        """Get required number of elements based on difficulty"""
        if self.difficulty == "beginner":
            return 3
        elif self.difficulty == "intermediate":
            return 5
        else:  # expert
            return 7

    def _level_up(self):
        """Level up based on completed scenes"""
        if self.completed_scenes >= 10:
            self.level = 3
            self.difficulty = "expert"
        elif self.completed_scenes >= 5:
            self.level = 2
            self.difficulty = "intermediate"

    def award_badge(self):
        """Award badges based on points and difficulty"""
        if self.points >= 50 and self.difficulty == "expert":
            self.badges.append("Master Creator")
        elif self.points >= 30 and self.difficulty == "intermediate":
            self.badges.append("Creative Artist")
        elif self.points >= 15:
            self.badges.append("Rising Star")
        else:
            self.badges.append("Scene Builder")

    def get_ai_suggestions(self):
        """Get AI-powered suggestions for the next elements to add"""
        # Define element categories
        backgrounds = ["Mountain", "Beach", "Forest", "City", "Space"]
        elements = {
            "nature": ["Tree", "River", "Mountain", "Cloud", "Flower", "Bird"],
            "structures": ["House", "Bridge", "Castle", "Boat"],
            "decorative": ["Sun", "Star"]
        }
        
        # If no background is selected, suggest one
        if not self.background:
            return {"suggestion_type": "background", "suggestions": backgrounds[:3]}
        
        # If background is selected, suggest elements that match the background
        suggestions = []
        background_lower = self.background.lower()
        
        if "mountain" in background_lower or "forest" in background_lower:
            suggestions = elements["nature"][:4]
        elif "beach" in background_lower:
            suggestions = ["Boat", "Sun", "Cloud", "Bird"]
        elif "city" in background_lower:
            suggestions = elements["structures"][:3] + ["Sun"]
        elif "space" in background_lower:
            suggestions = ["Star", "Castle", "Cloud"]
        else:
            # Generic suggestions
            suggestions = ["Tree", "House", "Sun", "Cloud"]
        
        # Remove elements already added
        suggestions = [s for s in suggestions if s not in self.elements]
        
        # Return top 3 suggestions
        return {"suggestion_type": "element", "suggestions": suggestions[:3]}

    def ai_adjust_difficulty(self):
        """AI-powered dynamic difficulty adjustment"""
        # If user is doing well, increase difficulty
        if len(self.elements) > 0 and self.points / len(self.elements) > 8:
            if self.difficulty == "beginner":
                self.difficulty = "intermediate"
            elif self.difficulty == "intermediate":
                self.difficulty = "expert"
        
        # If user is struggling, decrease difficulty
        elif len(self.elements) > 3 and self.points / len(self.elements) < 4:
            if self.difficulty == "expert":
                self.difficulty = "intermediate"
            elif self.difficulty == "intermediate":
                self.difficulty = "beginner"
        
        return f"Difficulty adjusted to {self.difficulty}"

# Simple leaderboard (in-memory)
leaderboard = []

def update_leaderboard(user_name, points):
    """Update the leaderboard with user's points"""
    leaderboard.append({"user": user_name, "points": points})
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return leaderboard[:5]

# Simulated gameplay run
if __name__ == "__main__":
    game1 = EnhancedDragDropGame("Aditi", 1)
    print(game1.choose_background("Mountain"))
    print(game1.add_element("Tree"))
    print(game1.add_element("River"))
    print(game1.add_element("House"))
    print(game1.check_scene())
    print("AI Suggestions:", game1.get_ai_suggestions())
    
    game2 = EnhancedDragDropGame("Rohan", 2)
    print(game2.choose_background("Beach"))
    print(game2.add_element("Sun"))
    print(game2.add_element("House"))
    print(game2.add_element("Tree"))
    print(game2.check_scene())
    print("AI Suggestions:", game2.get_ai_suggestions())
    
    # Update leaderboard
    top = update_leaderboard(game1.user_name, game1.points)
    top = update_leaderboard(game2.user_name, game2.points)
    print("\nLeaderboard:", top)