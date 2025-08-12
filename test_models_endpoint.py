#!/usr/bin/env python3
"""
Simple test script for the /v1/models endpoint
"""

import requests
import json

def test_models_endpoint():
    """Test the models endpoint."""
    PROXY_URL = "http://localhost:8001"  # Default proxy port
    
    try:
        print(f"🧪 Testing models endpoint at {PROXY_URL}/v1/models")
        print("=" * 50)
        
        response = requests.get(f"{PROXY_URL}/v1/models", timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Models endpoint successful!")
            
            try:
                models_data = response.json()
                print(f"📄 Response format: {type(models_data)}")
                
                if isinstance(models_data, dict):
                    print(f"🔑 Response keys: {list(models_data.keys())}")
                    
                    if 'data' in models_data and isinstance(models_data['data'], list):
                        print(f"🤖 Found {len(models_data['data'])} models:")
                        for i, model in enumerate(models_data['data'], 1):
                            model_id = model.get('id', 'Unknown')
                            model_type = model.get('object', 'Unknown')
                            print(f"   {i}. {model_id} ({model_type})")
                    else:
                        print("📋 Response structure:", json.dumps(models_data, indent=2))
                else:
                    print("📋 Response is not a dictionary:", models_data)
                    
            except json.JSONDecodeError as e:
                print(f"⚠️  Response is not valid JSON: {e}")
                print(f"📄 Raw response: {response.text[:200]}...")
                
        else:
            print(f"❌ Models endpoint failed with status {response.status_code}")
            print(f"📄 Error response: {response.text}")
            
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - is the proxy server running?")
        print("💡 Make sure to start the server first:")
        print("   docker-compose up -d")
        return False
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    success = test_models_endpoint()
    if success:
        print("\n🎉 Models endpoint test completed successfully!")
    else:
        print("\n💥 Models endpoint test failed!")
        exit(1)
