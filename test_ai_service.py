import requests
import json

def test_ai_service():
    print("Testing AI Service...")
    
    # Test the health endpoint
    try:
        health_response = requests.get("http://localhost:5001/health")
        print(f"Health check: {health_response.status_code} - {health_response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Test the adaptive suggest endpoint with user ID 1
    try:
        suggestions_response = requests.get("http://localhost:5001/adaptive_suggest?user_id=1")
        print(f"Adaptive suggestions: {suggestions_response.status_code}")
        if suggestions_response.status_code == 200:
            data = suggestions_response.json()
            print("Response data:")
            print(json.dumps(data, indent=2))
        else:
            print(f"Error response: {suggestions_response.text}")
    except Exception as e:
        print(f"Adaptive suggestions failed: {e}")

if __name__ == "__main__":
    test_ai_service()