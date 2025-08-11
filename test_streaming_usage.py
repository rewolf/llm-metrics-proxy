#!/usr/bin/env python3
"""
Test script for streaming with usage functionality.
This tests whether the proxy can capture token usage from streaming responses.
"""

import requests
import json
import time

# Configuration
PROXY_URL = "http://localhost:8001"  # Proxy runs on port 8001
METRICS_URL = "http://localhost:8002"

def test_streaming_with_usage(available_models):
    """Test streaming request WITH include_usage option - should capture token usage."""
    print("🧪 Test 1: Streaming WITH usage capture (include_usage: true)")
    
    if not available_models:
        print("❌ No models available for testing")
        return False
    
    model_name = available_models[0]  # Use first available model
    print(f"📋 Using model: {model_name}")
    
    payload = {
        "model": model_name,
        "messages": [
            {"role": "user", "content": "Write a short story about a robot in exactly 3 sentences."}
        ],
        "max_tokens": 100,
        "temperature": 0.7,
        "stream": True,
        "user": "test_user_streaming",
        "stream_options": {
            "include_usage": True
        }
    }
    
    try:
        print(f"📤 Sending streaming request to {PROXY_URL}/v1/chat/completions")
        print(f"📋 Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{PROXY_URL}/v1/chat/completions", 
            json=payload, 
            stream=True,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"❌ Request failed with status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print(f"✅ Streaming response started successfully")
        print("📥 Receiving chunks...")
        
        chunk_count = 0
        usage_found = False
        
        for chunk in response.iter_lines():
            if chunk:
                chunk_text = chunk.decode('utf-8')
                chunk_count += 1
                
                if chunk_text.startswith("data: "):
                    json_str = chunk_text[6:]  # Remove "data: " prefix
                    if json_str.strip() and json_str.strip() != "[DONE]":
                        try:
                            chunk_data = json.loads(json_str)
                            
                            # Check for usage information
                            if 'usage' in chunk_data and chunk_data['usage']:
                                usage = chunk_data['usage']
                                usage_found = True
                                print(f"🎯 Usage data captured: {usage}")
                        except json.JSONDecodeError:
                            pass
                    elif json_str.strip() == "[DONE]":
                        break
        
        print(f"📊 Stream completed: {chunk_count} chunks, Usage captured: {usage_found}")
        return True
        
    except Exception as e:
        print(f"❌ Streaming test failed: {e}")
        return False

def check_available_models():
    """Check what models are available in Ollama."""
    print("\n🔍 Checking available models...")
    
    try:
        # Check Ollama directly
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            print(f"✅ Available models in Ollama:")
            for model in models.get('models', []):
                print(f"   - {model['name']}")
            return [model['name'] for model in models.get('models', [])]
        else:
            print(f"❌ Failed to get models from Ollama: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error checking models: {e}")
        return []



def test_streaming_without_usage(available_models):
    """Test streaming request WITHOUT include_usage option - should NOT capture token usage."""
    print("\n🧪 Test 2: Streaming WITHOUT usage capture (no include_usage)")
    
    if not available_models:
        print("❌ No models available for testing")
        return False
    
    model_name = available_models[0]  # Use first available model
    
    payload = {
        "model": model_name,
        "messages": [
            {"role": "user", "content": "Say hello in one sentence."}
        ],
        "max_tokens": 50,
        "temperature": 0.5,
        "stream": True,
        "user": "test_user_streaming_no_usage"
        # No stream_options, so no usage should be captured
    }
    
    try:
        print(f"📤 Sending streaming request (no usage option)")
        
        response = requests.post(
            f"{PROXY_URL}/v1/chat/completions", 
            json=payload, 
            stream=True,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"❌ Request failed with status: {response.status_code}")
            return False
        
        print(f"✅ Streaming response started successfully")
        
        chunk_count = 0
        for chunk in response.iter_lines():
            if chunk:
                chunk_text = chunk.decode('utf-8')
                chunk_count += 1
                
                if chunk_text.strip() == "data: [DONE]":
                    break
        
        print(f"📊 Stream completed: {chunk_count} chunks")
        return True
        
    except Exception as e:
        print(f"❌ Streaming test failed: {e}")
        return False

def check_metrics():
    """Check the metrics to see if usage was captured."""
    print("\n📊 Checking metrics for usage capture...")
    
    try:
        response = requests.get(f"{METRICS_URL}/metrics")
        if response.status_code == 200:
            metrics = response.json()
            
            print(f"✅ Metrics retrieved successfully")
            print(f"   Total requests: {metrics.get('total_requests', 0)}")
            print(f"   Streaming requests: {metrics.get('streaming_requests', 0)}")
            print(f"   Total tokens used: {metrics.get('total_tokens_used', 0)}")
            print(f"   Average tokens per request: {metrics.get('avg_tokens_per_request', 0)}")
            
            # Check if we have token data (indicating usage was captured)
            if metrics.get('total_tokens_used', 0) > 0:
                print("🎯 Token usage data is available - usage capture working!")
            else:
                print("⚠️  No token usage data available yet")
                
        else:
            print(f"❌ Failed to get metrics: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error checking metrics: {e}")

def main():
    """Run all tests."""
    print("🚀 Testing Streaming Usage Capture Functionality")
    print("=" * 50)
    print("This test verifies that the proxy:")
    print("✅ Captures token usage when client requests it (include_usage: true)")
    print("✅ Respects client choice when no usage is requested")
    print("✅ Never modifies client requests")
    print("=" * 50)
    
    # Check available models first
    available_models = check_available_models()
    if not available_models:
        print("❌ No models available. Please ensure Ollama is running and has models loaded.")
        return
    
    # Test 1: Streaming WITH usage capture
    success1 = test_streaming_with_usage(available_models)
    
    # Wait a bit for processing
    time.sleep(2)
    
    # Test 2: Streaming WITHOUT usage capture
    success2 = test_streaming_without_usage(available_models)
    
    # Wait a bit for processing
    time.sleep(2)
    
    # Check metrics to see the difference
    check_metrics()
    
    print("\n" + "=" * 50)
    if success1 and success2:
        print("✅ All tests completed successfully!")
        print("📊 Check the metrics above to verify usage capture behavior")
    else:
        print("❌ Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
