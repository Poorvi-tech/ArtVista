import json
import random
import os
from collections import defaultdict

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

def get_user_preferences(user_id):
    """Get user preferences based on their profile and interaction history"""
    user = next(u for u in data["users"] if u["id"] == user_id)
    return user["preferences"]

def generate_color_palettes(user_preferences):
    """Generate color palettes based on user preferences"""
    # Define color palettes for different styles
    style_palettes = {
        "landscape": [
            {"name": "Nature's Harmony", "colors": ["#4CAF50", "#8BC34A", "#CDDC39"]},
            {"name": "Earth Tones", "colors": ["#795548", "#5D4037", "#3E2723"]},
            {"name": "Sky Blues", "colors": ["#03A9F4", "#2196F3", "#1976D2"]}
        ],
        "urban": [
            {"name": "City Neutrals", "colors": ["#9E9E9E", "#757575", "#616161"]},
            {"name": "Neon Nights", "colors": ["#FF4081", "#E040FB", "#7C4DFF"]},
            {"name": "Concrete Jungle", "colors": ["#607D8B", "#546E7A", "#455A64"]}
        ],
        "abstract": [
            {"name": "Bold Contrasts", "colors": ["#F44336", "#FFC107", "#4CAF50"]},
            {"name": "Pastel Dreams", "colors": ["#FFCDD2", "#F8BBD0", "#E1BEE7"]},
            {"name": "Vibrant Spectrum", "colors": ["#FF5722", "#FF9800", "#FFEB3B"]}
        ],
        "watercolor": [
            {"name": "Soft Washes", "colors": ["#BBDEFB", "#B3E5FC", "#B2EBF2"]},
            {"name": "Blush Tones", "colors": ["#FFCDD2", "#F8BBD0", "#E1BEE7"]},
            {"name": "Aqua Mist", "colors": ["#B2DFDB", "#C8E6C9", "#DCEDC8"]}
        ],
        "oil": [
            {"name": "Rich Earth", "colors": ["#5D4037", "#6D4C41", "#795548"]},
            {"name": "Deep Jewel", "colors": ["#311B92", "#1A237E", "#0D47A1"]},
            {"name": "Warm Sunset", "colors": ["#E65100", "#EF6C00", "#F57C00"]}
        ]
    }
    
    # Select palettes based on user preferences
    palettes = []
    for pref in user_preferences:
        if pref in style_palettes:
            # Add one random palette from this style
            palette = random.choice(style_palettes[pref])
            if palette not in palettes:
                palettes.append(palette)
    
    # If we don't have enough palettes, add some random ones
    all_palettes = [palette for palettes_list in style_palettes.values() for palette in palettes_list]
    while len(palettes) < 3:
        palette = random.choice(all_palettes)
        if palette not in palettes:
            palettes.append(palette)
    
    return palettes

def generate_techniques(user_preferences):
    """Generate techniques based on user preferences"""
    # Define techniques for different styles and mediums
    style_techniques = {
        "landscape": [
            "Layering technique for depth",
            "Atmospheric perspective",
            "Wet-on-wet watercolor blending",
            "Glazing for luminous effects"
        ],
        "urban": [
            "Cross-hatching for texture",
            "Linear perspective",
            "Plein air sketching",
            "Architectural drawing techniques"
        ],
        "abstract": [
            "Palette knife painting",
            "Impasto technique",
            "Color blocking",
            "Gestural brushwork"
        ],
        "watercolor": [
            "Wet-on-wet technique",
            "Dry brush technique",
            "Salt texture technique",
            "Lifting technique"
        ],
        "oil": [
            "Alla prima (wet-on-wet)",
            "Glazing technique",
            "Impasto technique",
            "Scumbling technique"
        ]
    }
    
    # Select techniques based on user preferences
    techniques = []
    for pref in user_preferences:
        if pref in style_techniques:
            # Add one random technique from this style
            technique = random.choice(style_techniques[pref])
            if technique not in techniques:
                techniques.append(technique)
    
    # If we don't have enough techniques, add some random ones
    all_techniques = [technique for techniques_list in style_techniques.values() for technique in techniques_list]
    while len(techniques) < 3:
        technique = random.choice(all_techniques)
        if technique not in techniques:
            techniques.append(technique)
    
    return techniques

def generate_themes(user_preferences):
    """Generate themes based on user preferences"""
    # Define themes for different styles
    style_themes = {
        "landscape": [
            "Seasonal changes",
            "Weather effects",
            "Natural landmarks",
            "Floral studies"
        ],
        "urban": [
            "City architecture",
            "Street life",
            "Transportation",
            "Night scenes"
        ],
        "abstract": [
            "Emotional expressions",
            "Geometric patterns",
            "Color relationships",
            "Movement and rhythm"
        ],
        "nature": [
            "Wildlife portraits",
            "Botanical studies",
            "Seascapes",
            "Mountain vistas"
        ],
        "digital": [
            "Cyberpunk aesthetics",
            "Glitch art",
            "Pixel art",
            "Vector illustrations"
        ]
    }
    
    # Select themes based on user preferences
    themes = []
    for pref in user_preferences:
        if pref in style_themes:
            # Add one random theme from this style
            theme = random.choice(style_themes[pref])
            if theme not in themes:
                themes.append(theme)
    
    # If we don't have enough themes, add some random ones
    all_themes = [theme for themes_list in style_themes.values() for theme in themes_list]
    while len(themes) < 3:
        theme = random.choice(all_themes)
        if theme not in themes:
            themes.append(theme)
    
    return themes

def art_creation_suggestions(user_id):
    """Generate personalized art creation suggestions for a user"""
    # Get user preferences
    user_preferences = get_user_preferences(user_id)
    
    # Generate suggestions
    color_palettes = generate_color_palettes(user_preferences)
    techniques = generate_techniques(user_preferences)
    themes = generate_themes(user_preferences)
    
    return {
        "colorPalettes": color_palettes,
        "techniques": techniques,
        "themes": themes
    }

# Example usage
if __name__ == "__main__":
    print("Art Creation Suggestions for Aditi:")
    print(json.dumps(art_creation_suggestions(1), indent=2))
    
    print("\nArt Creation Suggestions for Rohan:")
    print(json.dumps(art_creation_suggestions(2), indent=2))