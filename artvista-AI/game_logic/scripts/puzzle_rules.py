# Puzzle Rules (Week 1 Draft)

# Drag-and-Drop Scene Maker (pseudo logic)
def scene_maker(user_actions):
    placed_elements = len(user_actions["elements"])
    
    if placed_elements >= 3:
        return {"status": "completed", "message": "Scene created successfully!", "points": 10}
    else:
        return {"status": "incomplete", "message": "Add more elements to complete the scene."}


# Jigsaw Puzzle (pseudo logic)
def jigsaw_puzzle(pieces_correct):
    if pieces_correct == True:
        return {"status": "completed", "message": "Puzzle solved!", "points": 20}
    else:
        return {"status": "incomplete", "message": "Keep trying."}
