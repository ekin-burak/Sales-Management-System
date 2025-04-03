FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/api-gateway/package*.json ./services/api-gateway/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set working directory to api gateway
WORKDIR /app/services/api-gateway

EXPOSE 3000

CMD ["npm", "start"] 