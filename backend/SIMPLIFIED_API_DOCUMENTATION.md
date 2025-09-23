# ZFit Simplified API Documentation

Basic CRUD operations for Facilities, Classes, and Trainers.

## Base URL
```
/api/v1
```

## Facilities API

### 1. Create Facility
**POST** `/facilities`
```json
{
  "name": "Main Gym",
  "description": "Primary gym facility",
  "type": "gym",
  "location": "Ground Floor, Room 101",
  "capacity": 50
}
```

### 2. Get All Facilities
**GET** `/facilities`

### 3. Get Facility by ID
**GET** `/facilities/:id`

### 4. Update Facility
**PUT** `/facilities/:id`
```json
{
  "name": "Updated Gym Name",
  "capacity": 60
}
```

### 5. Delete Facility
**DELETE** `/facilities/:id`

**Facility Types:** gym, pool, studio, court, other

## Classes API

### 1. Create Class
**POST** `/classes`
```json
{
  "name": "Morning Yoga",
  "description": "Beginner-friendly yoga class",
  "type": "yoga",
  "duration": 60,
  "maxCapacity": 20,
  "trainer": "trainer_user_id",
  "facility": "facility_id",
  "schedule": {
    "day": "monday",
    "startTime": "07:00",
    "endTime": "08:00"
  },
  "price": 1000
}
```

### 2. Get All Classes
**GET** `/classes`

### 3. Get Class by ID
**GET** `/classes/:id`

### 4. Update Class
**PUT** `/classes/:id`

### 5. Delete Class
**DELETE** `/classes/:id`

**Class Types:** yoga, pilates, zumba, spinning, crossfit, strength, cardio, other

## Trainers API

### 1. Create Trainer
**POST** `/trainers`
```json
{
  "userId": "user_id",
  "specialization": "strength_training",
  "experience": 5,
  "bio": "Experienced personal trainer with 5 years in the industry"
}
```

### 2. Get All Trainers
**GET** `/trainers`

### 3. Get Trainer by ID
**GET** `/trainers/:id`

### 4. Update Trainer
**PUT** `/trainers/:id`

### 5. Delete Trainer
**DELETE** `/trainers/:id`

**Trainer Specializations:** strength_training, cardio, yoga, pilates, martial_arts, swimming, dance, nutrition, other

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Usage Examples

### Get all facilities
```
GET /api/v1/facilities
```

### Get all classes
```
GET /api/v1/classes
```

### Get all trainers
```
GET /api/v1/trainers
```

### Create a new facility
```
POST /api/v1/facilities
Content-Type: application/json

{
  "name": "Swimming Pool",
  "description": "Olympic size swimming pool",
  "type": "pool",
  "location": "Level 2, Pool Area",
  "capacity": 30
}
```

### Create a new class
```
POST /api/v1/classes
Content-Type: application/json

{
  "name": "Cardio Blast",
  "description": "High-intensity cardio workout",
  "type": "cardio",
  "duration": 45,
  "maxCapacity": 25,
  "trainer": "64f1234567890abcdef12345",
  "facility": "64f1234567890abcdef12346",
  "schedule": {
    "day": "tuesday",
    "startTime": "18:00",
    "endTime": "18:45"
  },
  "price": 1500
}
```

### Create a new trainer
```
POST /api/v1/trainers
Content-Type: application/json

{
  "userId": "64f1234567890abcdef12347",
  "specialization": "cardio",
  "experience": 3,
  "bio": "Certified cardio trainer specializing in HIIT workouts"
}
```

## HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
