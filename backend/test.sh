#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}' | jq -r '.token')

echo "Token: $TOKEN"

curl -s -X POST http://localhost:5000/api/stories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Story 2","description":"Dusri test story","content":"Ye story ka poora content hai jo backend test ke liye likha gaya hai kam se kam tees characters ka.","category":"Motivation","status":"published"}' | jq