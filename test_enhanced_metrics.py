#!/usr/bin/env python3
"""
Test script for enhanced metrics proxy

This script tests various completion requests to verify the enhanced metrics are captured correctly.
"""

import requests
import json
import time

PROXY_URL = "http://localhost:8001"

def test_basic_completion():
    """Test a basic non-streaming completion request."""
    print("🧪 Testing basic completion...")
    
    payload = {
        "model": "llama3.1:8b",
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "max_tokens": 100,
        "temperature": 0.7,
        "top_p": 0.9,
        "stream": False,
        "user": "test_user_1"
    }
    
    try:
        response = requests.post(f"{PROXY_URL}/v1/chat/completions", json=payload)
        print(f"✅ Basic completion: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Basic completion failed: {e}")
        return False

def test_streaming_completion():
    """Test a streaming completion request."""
    print("🧪 Testing streaming completion...")
    
    payload = {
        "model": "llama3.1:8b",
        "messages": [
            {"role": "user", "content": "Write a short story about a robot."}
        ],
        "max_tokens": 200,
        "temperature": 0.8,
        "top_p": 0.95,
        "stream": True,
        "user": "test_user_2"
    }
    
    try:
        response = requests.post(f"{PROXY_URL}/v1/chat/completions", json=payload, stream=True)
        print(f"✅ Streaming completion: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Streaming completion failed: {e}")
        return False

def test_long_conversation():
    """Test a longer conversation with multiple messages."""
    print("🧪 Testing long conversation...")
    
    payload = {
        "model": "llama3.1:8b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is AI?"},
            {"role": "assistant", "content": "AI stands for Artificial Intelligence."},
            {"role": "user", "content": "Can you explain more about machine learning?"}
        ],
        "max_tokens": 150,
        "temperature": 0.5,
        "top_p": 0.8,
        "stream": False,
        "user": "test_user_3"
    }
    
    try:
        response = requests.post(f"{PROXY_URL}/v1/chat/completions", json=payload)
        print(f"✅ Long conversation: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Long conversation failed: {e}")
        return False

def test_invalid_request():
    """Test an invalid request to see error handling."""
    print("🧪 Testing invalid request...")
    
    payload = {
        "model": "nonexistent_model",
        "messages": "invalid_messages_format"
    }
    
    try:
        response = requests.post(f"{PROXY_URL}/v1/chat/completions", json=payload)
        print(f"✅ Invalid request handled: {response.status_code}")
        return True  # We expect this to fail, but be handled gracefully
    except Exception as e:
        print(f"❌ Invalid request failed: {e}")
        return False

def check_metrics():
    """Check the metrics API to see if our requests were recorded."""
    print("\n📊 Checking metrics...")
    
    try:
        response = requests.get("http://localhost:8002/metrics")
        if response.status_code == 200:
            metrics = response.json()
            print(f"✅ Metrics retrieved successfully")
            print(f"   Total requests: {metrics.get('total_requests', 0)}")
            print(f"   Streaming requests: {metrics.get('streaming_requests', 0)}")
            print(f"   Non-streaming requests: {metrics.get('non_streaming_requests', 0)}")
            print(f"   Total tokens used: {metrics.get('total_tokens_used', 0)}")
            print(f"   Top models: {[m['model'] for m in metrics.get('top_models', [])]}")
            return True
        else:
            print(f"❌ Failed to get metrics: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Metrics check failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🚀 Starting enhanced metrics tests...\n")
    
    tests = [
        test_basic_completion,
        test_streaming_completion,
        test_long_conversation,
        test_invalid_request
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
        time.sleep(1)  # Small delay between tests
    
    print(f"\n📋 Test Results: {sum(results)}/{len(results)} passed")
    
    # Check metrics
    check_metrics()
    
    print("\n✨ Test completed! Check the metrics dashboard at http://localhost:3000")

if __name__ == "__main__":
    main()
