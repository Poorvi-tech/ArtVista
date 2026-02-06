# scripts/drag_drop_game.py

class DragDropGame:
    def __init__(self, user_name):
        self.user_name = user_name
        self.background = None
        self.elements = []
        self.points = 0
        self.badges = []

    # Background select karna
    def choose_background(self, bg):
        self.background = bg
        return f"Background set to {bg}"

    # Elements add karna with point values
    def add_element(self, element):
        self.elements.append(element)
        # Points based on element type
        element_points = {"Tree": 5, "River": 5, "House": 10, "Sun": 2}
        self.points += element_points.get(element, 0)
        return f"Added {element} (+{element_points.get(element, 0)} points)"

    # Check scene completion
    def check_scene(self):
        if len(self.elements) >= 3:
            self.award_badge()
            return {
                "status": "completed",
                "message": f"Scene created! Total points: {self.points}, Badges: {self.badges}",
                "points": self.points,
                "badges": self.badges
            }
        else:
            return {
                "status": "incomplete",
                "message": "Add more elements to complete the scene.",
                "points": self.points,
                "badges": self.badges
            }

    # Badge system
    def award_badge(self):
        if self.points >= 15:
            self.badges.append("Master Creator")
        elif self.points >= 10:
            self.badges.append("Creative Artist")
        else:
            self.badges.append("Rising Star")

# Simple leaderboard (in-memory)
leaderboard = []

def update_leaderboard(user_name, points):
    leaderboard.append({"user": user_name, "points": points})
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return leaderboard[:5]

# Simulated gameplay run
if __name__ == "__main__":
    game1 = DragDropGame("Aditi")
    print(game1.choose_background("Mountain"))
    print(game1.add_element("Tree"))
    print(game1.add_element("River"))
    print(game1.add_element("House"))
    print(game1.check_scene())

    game2 = DragDropGame("Rohan")
    print(game2.choose_background("Beach"))
    print(game2.add_element("Sun"))
    print(game2.add_element("House"))
    print(game2.add_element("Tree"))
    print(game2.check_scene())

    # Update leaderboard
    top = update_leaderboard(game1.user_name, game1.points)
    top = update_leaderboard(game2.user_name, game2.points)
    print("\nLeaderboard:", top)
