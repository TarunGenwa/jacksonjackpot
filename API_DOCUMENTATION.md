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