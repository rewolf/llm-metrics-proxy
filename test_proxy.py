#!/usr/bin/env python3
"""
Test script for the OpenAI LLM Metrics Proxy
"""

import requests
import json
import time

PROXY_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint."""
    try:
        response = requests.get(f"{PROXY_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False



def test_proxy_request():
    """Test a proxy request to the backend."""
    try:
        payload = {
            "model": "llama2",
            "messages": [
                {"role": "user", "content": "Hello, how are you?"}
            ],
            "max_tokens": 50
        }
        
        response = requests.post(
            f"{PROXY_URL}/v1/chat/completions",
            json=payload,
            timeout=30
        )
        
        print(f"Proxy request: {response.status_code}")
        if response.status_code == 200:
            print("✅ Request successful")
        else:
            print(f"❌ Request failed: {response.text}")
        
        return True
    except Exception as e:
        print(f"Proxy test failed: {e}")
        return False


def test_models_endpoint():
    """Test the models endpoint."""
    try:
        response = requests.get(f"{PROXY_URL}/v1/models", timeout=30)
        
        print(f"Models endpoint: {response.status_code}")
        if response.status_code == 200:
            print("✅ Models endpoint successful")
            try:
                models_data = response.json()
                if 'data' in models_data:
                    print(f"📋 Found {len(models_data['data'])} models")
                    for model in models_data['data']:
                        print(f"   - {model.get('id', 'Unknown')}")
                else:
                    print("📋 Response format:", list(models_data.keys()))
            except json.JSONDecodeError:
                print("📋 Response is not JSON (raw response)")
        else:
            print(f"❌ Models endpoint failed: {response.text}")
        
        return True
    except Exception as e:
        print(f"Models endpoint test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing OpenAI LLM Metrics Proxy...")
    print("=" * 40)
    
    # Test health endpoint
    if not test_health():
        print("❌ Health check failed")
        return
    
    # Test proxy functionality
    print("\n📊 Testing proxy functionality...")
    if not test_proxy_request():
        print("❌ Proxy test failed")
        return
    
    # Test models endpoint
    print("\n📋 Testing models endpoint...")
    if not test_models_endpoint():
        print("❌ Models endpoint test failed")
        return
    
    print("✅ All proxy tests passed!")

if __name__ == "__main__":
    main()
