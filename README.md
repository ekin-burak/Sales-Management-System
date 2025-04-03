# Sales Management System

A microservices-based sales management system built with Node.js, Express, and MongoDB.

## Features

- User Management with JWT Authentication
- Customer Management
- Sales Tracking with Pipeline
- API Gateway for Service Communication
- Swagger Documentation
- Docker Support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker and Docker Compose (optional)

## Project Structure

```
.
├── services/
│   ├── user-service/        # User management service
│   ├── customer-service/    # Customer management service
│   ├── sales-service/      # Sales tracking service
│   └── api-gateway/        # API Gateway
├── shared/
│   └── common/            # Shared utilities and types
└── docker-compose.yml     # Docker Compose configuration
```

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-management-backend
```

2. Install dependencies for each service:
```bash
cd services/user-service && npm install
cd ../customer-service && npm install
cd ../sales-service && npm install
cd ../api-gateway && npm install
```

3. Create .env files in each service directory (see .env.example files)

4. Start MongoDB:
```bash
mongod
```

5. Start each service:
```bash
# Terminal 1 - User Service
cd services/user-service && npm run dev

# Terminal 2 - Customer Service
cd services/customer-service && npm run dev

# Terminal 3 - Sales Service
cd services/sales-service && npm run dev

# Terminal 4 - API Gateway
cd services/api-gateway && npm run dev
```

### Using Docker

1. Build and start all services:
```bash
docker-compose up --build
```

2. Stop all services:
```bash
docker-compose down
```

## API Documentation

Each service provides Swagger documentation at:
- API Gateway: http://localhost:3000/api-docs
- User Service: http://localhost:3001/api-docs
- Customer Service: http://localhost:3002/api-docs
- Sales Service: http://localhost:3003/api-docs

## Testing

Run tests for each service:
```bash
cd services/user-service && npm test
cd ../customer-service && npm test
cd ../sales-service && npm test
```

## Environment Variables

Each service requires its own .env file. See the .env.example files in each service directory for required variables.
