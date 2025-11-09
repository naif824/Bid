#!/bin/bash

echo "Testing Admin API..."
echo ""

# Login
echo "1. Testing login..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

echo "Login response: $TOKEN_RESPONSE"
echo ""

# Extract token
TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to get token"
  exit 1
fi

echo "Token received: ${TOKEN:0:50}..."
echo ""

# Test users endpoint
echo "2. Testing users endpoint..."
USERS_RESPONSE=$(curl -s http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN")

echo "Users response: $USERS_RESPONSE"
echo ""

# Test items endpoint
echo "3. Testing items endpoint..."
ITEMS_RESPONSE=$(curl -s http://localhost:3000/api/admin/items \
  -H "Authorization: Bearer $TOKEN")

echo "Items response: $ITEMS_RESPONSE"
echo ""

echo "Test complete!"
