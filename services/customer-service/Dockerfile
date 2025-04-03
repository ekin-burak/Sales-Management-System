FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/customer-service/package*.json ./services/customer-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set working directory to customer service
WORKDIR /app/services/customer-service

EXPOSE 3002

CMD ["npm", "start"] 