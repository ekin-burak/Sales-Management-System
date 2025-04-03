FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/user-service/package*.json ./services/user-service/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN cd services/user-service && \
    npm install && \
    npm run build

# Set working directory to user service
WORKDIR /app/services/user-service

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"] 