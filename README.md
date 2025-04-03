# Sales Management System

A microservices-based sales management system built with Node.js, Express, and MongoDB.

## Features

- User Management with JWT Authentication
- Customer Management
- Sales Tracking with Pipeline
- API Gateway for Service Communication
- Swagger Documentation
- Docker Support
- Workspace-based Monorepo Structure

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Docker and Docker Compose (optional)

The system consists of four microservices:

- **API Gateway** (Port 3000) - Entry point for all client requests
- **User Service** (Port 3001) - Handles authentication and user management
- **Customer Service** (Port 3002) - Manages customer data and relationships
- **Sales Service** (Port 3003) - Tracks sales pipeline and opportunities

## 🛠️ Tech Stack

- **Backend**: Node.js & Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Documentation**: Swagger
- **Containerization**: Docker
- **Project Structure**: Monorepo with npm workspaces

## Project Structure

```
.
├── services/
│   ├── user-service/        # User management service
│   ├── customer-service/    # Customer management service
│   ├── sales-service/      # Sales tracking service
│   └── api-gateway/        # API Gateway
├── shared/                 # Shared modules and utilities
├── node_modules/          # Root level dependencies
├── package.json          # Workspace configuration
└── docker-compose.yml    # Docker Compose configuration
```

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-management-system
```

2. Install dependencies using workspace-based installation:
```bash
npm install
```

3. Create .env files in each service directory (see .env.example files)

4. Start MongoDB:
```bash
mongod
```

5. Start all services in development mode:
```bash
npm run dev
```

Alternatively, you can start individual services from their respective directories:
```bash
cd services/<service-name> && npm run dev
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

Run tests for all services:
```bash
npm test
```

To run tests for a specific service:
```bash
cd services/<service-name> && npm test
```

## Environment Variables

Each service requires its own .env file. See the .env.example files in each service directory for required variables.