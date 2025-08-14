#!/usr/bin/env python3
"""
Test runner for the LLM Metrics Proxy project.
"""

import os
import sys
import unittest
import subprocess

# Set testing environment variable to prevent production writes
os.environ['TESTING'] = 'true'

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_all_tests():
    """Discover and run all tests in the project."""
    # Discover tests in the backend/tests directory
    loader = unittest.TestLoader()
    start_dir = os.path.join('backend', 'tests')
    
    if not os.path.exists(start_dir):
        print(f"Test directory not found: {start_dir}")
        return False
    
    # Discover all test files
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return success/failure
    return result.wasSuccessful()

def run_specific_test(test_name):
    """Run a specific test module or test case."""
    loader = unittest.TestLoader()
    
    if test_name.endswith('.py'):
        # Run specific test file
        test_file = os.path.join('backend', 'tests', test_name)
        if not os.path.exists(test_file):
            print(f"Test file not found: {test_file}")
            return False
        
        suite = loader.loadTestsFromName(f'backend.tests.{test_name[:-3]}')
    else:
        # Run specific test class or method
        suite = loader.loadTestsFromName(f'backend.tests.{test_name}')
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()

def list_available_tests():
    """List all available test modules."""
    test_dir = os.path.join('backend', 'tests')
    if not os.path.exists(test_dir):
        print(f"Test directory not found: {test_dir}")
        return
    
    print("Available test modules:")
    for filename in os.listdir(test_dir):
        if filename.startswith('test_') and filename.endswith('.py'):
            print(f"  - {filename}")
    
    print("\nAvailable test classes:")
    loader = unittest.TestLoader()
    suite = loader.discover(test_dir, pattern='test_*.py')
    
    for test_group in suite:
        for test_case in test_group:
            for test_method in test_case:
                test_name = test_method.id()
                if '.' in test_name:
                    class_name = test_name.split('.')[1]
                    print(f"  - {class_name}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == '--list':
            list_available_tests()
        elif sys.argv[1] == '--help':
            print("Usage:")
            print("  python run_tests.py                    # Run all tests")
            print("  python run_tests.py --list            # List available tests")
            print("  python run_tests.py test_dao.py       # Run specific test file")
            print("  python run_tests.py TestDAO           # Run specific test class")
            print("  python run_tests.py --help            # Show this help")
        else:
            # Run specific test
            success = run_specific_test(sys.argv[1])
            sys.exit(0 if success else 1)
    else:
        # Run all tests
        print("Running all tests...")
        success = run_all_tests()
        sys.exit(0 if success else 1)
