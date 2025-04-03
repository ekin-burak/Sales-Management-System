const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/health', async (req, res) => {
  try {
    // Check user service health
    const userServiceHealth = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/health`);
    
    // Check customer service health
    const customerServiceHealth = await axios.get(`${process.env.CUSTOMER_SERVICE_URL}/api/customers/health`);
    
    // Check sales service health
    const salesServiceHealth = await axios.get(`${process.env.SALES_SERVICE_URL}/api/sales/health`);

    res.json({
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      services: {
        user: userServiceHealth.data,
        customer: customerServiceHealth.data,
        sales: salesServiceHealth.data
      }
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({
      status: 'error',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 