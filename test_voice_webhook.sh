# Voice Assistant Testing Script

# Test different webhook scenarios for the ZFit voice assistant

# 1. Test basic conversation message
curl -X POST http://localhost:5000/api/v1/support/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "conversation",
    "message": "What are your gym hours?",
    "call_id": "test-call-001",
    "customer": "member-123"
  }'

# 2. Test call started event
curl -X POST http://localhost:5000/api/v1/support/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call_started",
    "call_id": "test-call-001",
    "customer": "member-123"
  }'

# 3. Test call ended event
curl -X POST http://localhost:5000/api/v1/support/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call_ended",
    "call_id": "test-call-001",
    "customer": "member-123",
    "duration": 120
  }'

# 4. Test function call event
curl -X POST http://localhost:5000/api/v1/support/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "function_call",
    "message": "get_membership_info",
    "call_id": "test-call-001",
    "customer": "member-123"
  }'

# 5. Test through ngrok tunnel
curl -X POST https://smarty-lymphocytotic-larry.ngrok-free.dev/api/v1/support/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "conversation",
    "message": "How do I join the gym?",
    "call_id": "ngrok-test-001"
  }'