const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Service API',
      version: '1.0.0',
      description: 'API documentation for the Customer Service',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3002',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

// Add base path to all paths
if (swaggerSpec.paths) {
  const newPaths = {};
  Object.entries(swaggerSpec.paths).forEach(([path, methods]) => {
    newPaths[`/api${path}`] = methods;
  });
  swaggerSpec.paths = newPaths;
}

module.exports = swaggerSpec; 