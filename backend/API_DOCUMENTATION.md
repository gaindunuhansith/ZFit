# ZFit API Documentation - Facilities, Classes, and Trainers

This document outlines the CRUD operations available for members to view facilities, classes, and trainers in the ZFit gym management system.

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
  "description": "Primary gym facility with cardio and weight equipment",
  "type": "gym",
  "location": {
    "floor": "Ground",
    "room": "G01",
    "building": "Main Building"
  },
  "capacity": 50,
  "equipment": ["Treadmills", "Weight Machines", "Free Weights"],
  "amenities": ["Air Conditioning", "Water Station", "Music System"],
  "operatingHours": {
    "open": "06:00",
    "close": "22:00",
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  },
  "bookingRequired": false,
  "pricing": {
    "member": 0,
    "guest": 500,
    "hourly": false
  }
}
```

### 2. Get All Facilities
**GET** `/facilities`
Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): Filter by facility type
- `status` (optional): Filter by status (active, inactive, maintenance)
- `search` (optional): Search in name and description
- `floor` (optional): Filter by floor

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

### 5. Update Facility Status
**PATCH** `/facilities/:id/status`
```json
{
  "status": "maintenance"
}
```

### 6. Delete Facility
**DELETE** `/facilities/:id`

### 7. Get Available Facilities
**GET** `/facilities/available`

### 8. Get Facilities by Type
**GET** `/facilities/type/:type`
Types: gym, pool, studio, court, spa, cafe, locker, other

## Classes API

### 1. Create Class
**POST** `/classes`
```json
{
  "name": "Morning Yoga",
  "description": "Beginner-friendly yoga class",
  "type": "yoga",
  "level": "beginner",
  "duration": 60,
  "maxCapacity": 20,
  "trainer": "trainer_user_id",
  "facility": "facility_id",
  "schedule": {
    "days": ["monday", "wednesday", "friday"],
    "startTime": "07:00",
    "endTime": "08:00",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "recurring": true
  },
  "pricing": {
    "member": 1000,
    "guest": 2000,
    "dropIn": true
  },
  "requirements": ["Yoga Mat"],
  "equipment": ["Yoga Blocks", "Straps"],
  "image": "yoga_class_image.jpg"
}
```

### 2. Get All Classes
**GET** `/classes`
Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by class type
- `level` (optional): Filter by level (beginner, intermediate, advanced, all_levels)
- `status` (optional): Filter by status
- `trainer` (optional): Filter by trainer ID
- `facility` (optional): Filter by facility ID
- `day` (optional): Filter by day of week
- `search` (optional): Search in name and description

### 3. Get Class by ID
**GET** `/classes/:id`

### 4. Update Class
**PUT** `/classes/:id`

### 5. Update Class Enrollment
**PATCH** `/classes/:id/enrollment`
```json
{
  "change": 1
}
```

### 6. Update Class Status
**PATCH** `/classes/:id/status`
```json
{
  "status": "cancelled"
}
```

### 7. Delete Class
**DELETE** `/classes/:id`

### 8. Get Classes by Type
**GET** `/classes/type/:type`
Types: yoga, pilates, zumba, spinning, crossfit, martial_arts, dance, aerobics, strength, cardio, swimming, other

### 9. Get Classes by Trainer
**GET** `/classes/trainer/:trainerId`

### 10. Get Classes by Facility
**GET** `/classes/facility/:facilityId`

### 11. Get Upcoming Classes
**GET** `/classes/upcoming`

## Trainers API

### 1. Create Trainer
**POST** `/trainers`
```json
{
  "userId": "user_id",
  "specialization": ["strength_training", "cardio"],
  "certifications": [
    {
      "name": "Personal Trainer Certification",
      "issuer": "Fitness Institute",
      "date": "2023-01-15",
      "expiryDate": "2025-01-15",
      "certificateId": "PT-2023-001"
    }
  ],
  "experience": {
    "years": 5,
    "previousWorkplaces": ["Gold's Gym", "Fitness First"],
    "notableAchievements": ["Certified Strength Coach"]
  },
  "availability": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "startTime": "06:00",
    "endTime": "20:00",
    "timezone": "Asia/Colombo"
  },
  "services": {
    "personalTraining": true,
    "groupClasses": true,
    "onlineTraining": false,
    "nutritionConsultation": true,
    "injuryRehabilitation": false
  },
  "rates": {
    "personalTraining": 3000,
    "groupTraining": 1500,
    "onlineSession": 2000,
    "consultation": 1000
  },
  "bio": "Experienced personal trainer with 5 years in the industry",
  "profileImage": "trainer_profile.jpg",
  "languages": ["english", "sinhala"],
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+94771234567",
    "relationship": "Brother"
  }
}
```

### 2. Get All Trainers
**GET** `/trainers`
Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `specialization` (optional): Filter by specialization
- `status` (optional): Filter by status
- `service` (optional): Filter by service offered
- `day` (optional): Filter by available day
- `search` (optional): Search in bio and user info
- `minRating` (optional): Minimum rating filter

### 3. Get Trainer by ID
**GET** `/trainers/:id`

### 4. Get Trainer by User ID
**GET** `/trainers/user/:userId`

### 5. Update Trainer
**PUT** `/trainers/:id`

### 6. Update Trainer Status
**PATCH** `/trainers/:id/status`
```json
{
  "status": "active"
}
```

### 7. Update Trainer Rating
**PATCH** `/trainers/:id/rating`
```json
{
  "rating": 4.5
}
```

### 8. Delete Trainer
**DELETE** `/trainers/:id`

### 9. Get Trainers by Specialization
**GET** `/trainers/specialization/:specialization`
Specializations: strength_training, cardio, yoga, pilates, martial_arts, swimming, running, cycling, dance, rehabilitation, nutrition, weight_loss, muscle_gain, sports_specific, senior_fitness, prenatal, postnatal, other

### 10. Get Available Trainers
**GET** `/trainers/available?day=monday&time=10:00`

### 11. Get Top Rated Trainers
**GET** `/trainers/top-rated?limit=10`

### 12. Get Trainers by Service
**GET** `/trainers/service/:service`
Services: personalTraining, groupClasses, onlineTraining, nutritionConsultation, injuryRehabilitation

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // Only for paginated responses
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

### Pagination Object
```json
{
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 50,
  "itemsPerPage": 10,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## Usage Examples

### Get all active gym facilities
```
GET /api/v1/facilities?type=gym&status=active
```

### Get upcoming yoga classes
```
GET /api/v1/classes?type=yoga&status=active
```

### Get trainers available on Monday
```
GET /api/v1/trainers/available?day=monday
```

### Search for strength training classes
```
GET /api/v1/classes?search=strength&type=strength
```

### Get top 5 rated trainers
```
GET /api/v1/trainers/top-rated?limit=5
```

## Authentication

All endpoints require proper authentication. Include the authentication token in the request headers:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API uses HTTP status codes to indicate success or failure:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
