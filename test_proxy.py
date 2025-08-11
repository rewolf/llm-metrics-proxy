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

def test_metrics():
    """Test the metrics endpoint."""
    try:
        response = requests.get(f"{PROXY_URL}/metrics")
        print(f"Metrics: {response.status_code}")
        metrics = response.json()
        print(f"Total requests: {metrics['total_requests']}")
        print(f"Success rate: {metrics['success_rate']}%")
        return True
    except Exception as e:
        print(f"Metrics test failed: {e}")
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

def main():
    """Run all tests."""
    print("🧪 Testing OpenAI LLM Metrics Proxy...")
    print("=" * 40)
    
    # Test health endpoint
    if not test_health():
        print("❌ Health check failed")
        return
    
    # Test metrics endpoint
    if not test_metrics():
        print("❌ Metrics endpoint failed")
        return
    
    # Test proxy functionality
    print("\n📊 Testing proxy functionality...")
    if not test_proxy_request():
        print("❌ Proxy test failed")
        return
    
    # Wait a moment and check metrics again
    print("\n⏳ Waiting for metrics to update...")
    time.sleep(2)
    
    if test_metrics():
        print("✅ All tests passed!")
    else:
        print("❌ Final metrics check failed")

if __name__ == "__main__":
    main()
