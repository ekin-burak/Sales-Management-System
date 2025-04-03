const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { errorHandler } = require('./utils/errors');
const { authenticateToken } = require('./middleware/auth');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3002';
const SALES_SERVICE_URL = process.env.SALES_SERVICE_URL || 'http://localhost:3003';
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Proxy middleware configuration
const proxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users',
    '^/api/customers': '/api/customers',
    '^/api/sales': '/api/sales'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward the authorization header
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  }
};

// Routes
app.use('/api/users', authenticateToken, createProxyMiddleware({
  target: USER_SERVICE_URL,
  ...proxyOptions
}));

app.use('/api/customers', authenticateToken, createProxyMiddleware({
  target: CUSTOMER_SERVICE_URL,
  ...proxyOptions
}));

app.use('/api/sales', authenticateToken, createProxyMiddleware({
  target: SALES_SERVICE_URL,
  ...proxyOptions
}));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const services = [
      { name: 'user-service', url: `${USER_SERVICE_URL}/api/users/health` },
      { name: 'customer-service', url: `${CUSTOMER_SERVICE_URL}/api/customers/health` },
      { name: 'sales-service', url: `${SALES_SERVICE_URL}/api/sales/health` }
    ];

    const healthChecks = await Promise.allSettled(
      services.map(service => axios.get(service.url))
    );

    const status = healthChecks.every(check => check.status === 'fulfilled') ? 'ok' : 'degraded';
    const servicesStatus = services.map((service, index) => ({
      name: service.name,
      status: healthChecks[index].status === 'fulfilled' ? 'ok' : 'error',
      details: healthChecks[index].status === 'fulfilled' 
        ? healthChecks[index].value.data 
        : healthChecks[index].reason.message
    }));

    res.status(200).json({
      status,
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      uptime: process.uptime(),
      services: servicesStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling
app.use(errorHandler);

module.exports = app; 