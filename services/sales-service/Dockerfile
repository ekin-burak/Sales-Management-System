FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/sales-service/package*.json ./services/sales-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set working directory to sales service
WORKDIR /app/services/sales-service

EXPOSE 3003

CMD ["npm", "start"] 