# API Documentation

This document provides comprehensive documentation for all available API endpoints in the JJ Plus charity lottery platform.

## Base URL
```
http://localhost:8080
```

## Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### GET /
Check if the API is running.

**Request:**
```http
GET /
```

**Response:**
```json
"Hello World!"
```

**Status Codes:**
- `200 OK` - Service is running

---

### Authentication

#### POST /auth/signup
Register a new user account.

**Request:**
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Request Body Parameters:**
- `email` (required, string) - Valid email address
- `username` (required, string) - Username (min 3 characters, alphanumeric with underscores/hyphens)
- `password` (required, string) - Password (min 8 characters, must contain uppercase, lowercase, number, and special character)
- `firstName` (optional, string) - User's first name
- `lastName` (optional, string) - User's last name

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt-token-here"
}
```

**Status Codes:**
- `201 Created` - User successfully created
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email or username already exists

---

#### POST /auth/login
Authenticate user and get access token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Alternative (login with username):**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "Password123!"
}
```

**Request Body Parameters:**
- `email` (optional, string) - User's email address
- `username` (optional, string) - User's username
- `password` (required, string) - User's password

Note: Either `email` or `username` must be provided.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true
  },
  "accessToken": "jwt-token-here"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Invalid credentials

---

#### GET /auth/profile
Get current user's profile information.

**Request:**
```http
GET /auth/profile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "wallet": {
    "id": "wallet-uuid",
    "balance": "0.00",
    "currency": "GBP",
    "isLocked": false,
    "transactions": []
  }
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token

---

### Charities

#### GET /charities
Get all verified and active charities.

**Request:**
```http
GET /charities
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Cancer Research UK",
    "description": "The world's leading cancer charity dedicated to saving lives through research.",
    "logoUrl": "https://example.com/logo.jpg",
    "website": "https://www.cancerresearchuk.org",
    "email": "info@cancerresearchuk.org",
    "phone": "+44 20 7242 0200",
    "address": "2 Redman Place, London E20 1JQ, UK",
    "isVerified": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "_count": {
      "competitions": 3
    }
  }
]
```

**Status Codes:**
- `200 OK` - List retrieved successfully

---

#### GET /charities/:id
Get detailed information about a specific charity.

**Request:**
```http
GET /charities/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Cancer Research UK",
  "description": "The world's leading cancer charity dedicated to saving lives through research.",
  "logoUrl": "https://example.com/logo.jpg",
  "website": "https://www.cancerresearchuk.org",
  "email": "info@cancerresearchuk.org",
  "phone": "+44 20 7242 0200",
  "address": "2 Redman Place, London E20 1JQ, UK",
  "isVerified": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "competitions": [
    {
      "id": "competition-uuid",
      "title": "Win a Dream Holiday to the Maldives",
      "description": "Enter our amazing competition...",
      "ticketPrice": "5.00",
      "maxTickets": 10000,
      "ticketsSold": 3247,
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-15T00:00:00.000Z",
      "drawDate": "2025-01-16T00:00:00.000Z",
      "status": "ACTIVE",
      "imageUrl": "https://example.com/competition.jpg",
      "_count": {
        "prizes": 2
      }
    }
  ],
  "donations": [
    {
      "amount": "50.00",
      "currency": "GBP",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Charity retrieved successfully
- `404 Not Found` - Charity not found

---

### Competitions

#### GET /competitions
Get all active competitions with optional filtering.

**Request:**
```http
GET /competitions?status=ACTIVE&charityId=550e8400-e29b-41d4-a716-446655440000
```

**Query Parameters:**
- `status` (optional, string) - Filter by competition status (`ACTIVE`, `UPCOMING`, `COMPLETED`, etc.)
- `charityId` (optional, string) - Filter by charity ID

**Response:**
```json
[
  {
    "id": "competition-uuid",
    "title": "Win a Dream Holiday to the Maldives",
    "description": "Enter our amazing competition to win a 7-night all-inclusive holiday for 2 to the beautiful Maldives.",
    "ticketPrice": "5.00",
    "maxTickets": 10000,
    "ticketsSold": 3247,
    "minTickets": 100,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-15T00:00:00.000Z",
    "drawDate": "2025-01-16T00:00:00.000Z",
    "status": "ACTIVE",
    "imageUrl": "https://example.com/competition.jpg",
    "termsAndConditions": "Competition open to UK residents aged 18+...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "charity": {
      "id": "charity-uuid",
      "name": "Cancer Research UK",
      "logoUrl": "https://example.com/logo.jpg",
      "isVerified": true
    },
    "prizes": [
      {
        "id": "prize-uuid",
        "name": "Maldives Holiday for 2",
        "description": "7 nights all-inclusive luxury resort accommodation for 2 people including return flights",
        "value": "8000.00",
        "position": 1,
        "quantity": 1,
        "imageUrl": "https://example.com/prize.jpg"
      }
    ],
    "_count": {
      "tickets": 3247,
      "prizes": 2
    }
  }
]
```

**Status Codes:**
- `200 OK` - List retrieved successfully

---

#### GET /competitions/active
Get all currently active competitions.

**Request:**
```http
GET /competitions/active
```

**Response:**
Same format as `/competitions` but filtered to only show `ACTIVE` status competitions.

**Status Codes:**
- `200 OK` - List retrieved successfully

---

#### GET /competitions/upcoming
Get all upcoming competitions.

**Request:**
```http
GET /competitions/upcoming
```

**Response:**
Same format as `/competitions` but filtered to only show `UPCOMING` status competitions.

**Status Codes:**
- `200 OK` - List retrieved successfully

---

#### GET /competitions/:id
Get detailed information about a specific competition.

**Request:**
```http
GET /competitions/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Win a Dream Holiday to the Maldives",
  "description": "Enter our amazing competition to win a 7-night all-inclusive holiday for 2 to the beautiful Maldives.",
  "ticketPrice": "5.00",
  "maxTickets": 10000,
  "ticketsSold": 3247,
  "minTickets": 100,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-15T00:00:00.000Z",
  "drawDate": "2025-01-16T00:00:00.000Z",
  "status": "ACTIVE",
  "imageUrl": "https://example.com/competition.jpg",
  "termsAndConditions": "Competition open to UK residents aged 18+. Draw will be conducted by independent adjudicator.",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "charity": {
    "id": "charity-uuid",
    "name": "Cancer Research UK",
    "description": "The world's leading cancer charity dedicated to saving lives through research.",
    "logoUrl": "https://example.com/logo.jpg",
    "website": "https://www.cancerresearchuk.org",
    "email": "info@cancerresearchuk.org",
    "isVerified": true
  },
  "prizes": [
    {
      "id": "prize-uuid",
      "name": "Maldives Holiday for 2",
      "description": "7 nights all-inclusive luxury resort accommodation for 2 people including return flights",
      "value": "8000.00",
      "position": 1,
      "quantity": 1,
      "imageUrl": "https://example.com/prize.jpg"
    },
    {
      "id": "prize-uuid-2",
      "name": "£500 Travel Voucher",
      "description": "Holiday voucher to use with any major travel company",
      "value": "500.00",
      "position": 2,
      "quantity": 1,
      "imageUrl": "https://example.com/voucher.jpg"
    }
  ],
  "tickets": [
    {
      "id": "ticket-uuid",
      "ticketNumber": "TKT-2025-001234",
      "status": "ACTIVE",
      "purchasedAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "_count": {
    "tickets": 3247,
    "prizes": 2
  }
}
```

**Status Codes:**
- `200 OK` - Competition retrieved successfully
- `404 Not Found` - Competition not found

---

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string; // hashed
  role: "USER" | "ADMIN" | "MODERATOR";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Wallet
```typescript
{
  id: string;
  userId: string;
  balance: Decimal;
  currency: string;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
{
  id: string;
  walletId: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TICKET_PURCHASE" | "PRIZE_PAYOUT" | "REFUND" | "BONUS" | "FEE";
  amount: Decimal;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";
  description?: string;
  reference?: string;
  paymentProvider?: string;
  paymentReference?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
}
```

### Charity
```typescript
{
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  taxId: string;
  isVerified: boolean;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSortCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Competition
```typescript
{
  id: string;
  charityId: string;
  title: string;
  description: string;
  imageUrl?: string;
  ticketPrice: Decimal;
  maxTickets: number;
  ticketsSold: number;
  startDate: Date;
  endDate: Date;
  drawDate: Date;
  status: "DRAFT" | "UPCOMING" | "ACTIVE" | "SOLD_OUT" | "DRAWING" | "COMPLETED" | "CANCELLED";
  winnerCount: number;
  totalRaised: Decimal;
  charityPercentage: Decimal;
  createdAt: Date;
  updatedAt: Date;
}
```

### Ticket
```typescript
{
  id: string;
  competitionId: string;
  userId: string;
  ticketNumber: string;
  purchasePrice: Decimal;
  status: "ACTIVE" | "WINNER" | "EXPIRED" | "CANCELLED" | "REFUNDED";
  createdAt: Date;
  updatedAt: Date;
}
```

### Prize
```typescript
{
  id: string;
  competitionId: string;
  name: string;
  description?: string;
  value: Decimal;
  position: number;
  quantity: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Winner
```typescript
{
  id: string;
  competitionId: string;
  userId: string;
  ticketId: string;
  prizeId: string;
  status: "PENDING" | "NOTIFIED" | "CLAIMED" | "PAID" | "EXPIRED";
  claimedAt?: Date;
  paidOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Donation
```typescript
{
  id: string;
  charityId: string;
  userId?: string;
  amount: Decimal;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";
  paymentProvider?: string;
  paymentReference?: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "message": "Detailed error information",
  "statusCode": 400
}
```

### Common Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Rate Limiting
Currently no rate limiting is implemented, but it's recommended for production use.

## Pagination
For endpoints that return lists, pagination will follow this pattern:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Decimal values (amounts, balances) are returned as strings to prevent precision loss
- All requests must include `Content-Type: application/json` header when sending JSON data
- JWT tokens expire after a configurable time period (check with your system administrator)