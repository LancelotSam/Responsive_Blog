// backend/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Platform API',
      version: '1.0.0',
      description: 'API documentation for the Blog Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // Replace with your API base URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, specifies the token format
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f5c1234a5b6c789d0e0f12',
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-08-23T10:15:39.616Z',
            },
          },
          required: ['_id', 'username', 'email'],
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '66c8614bdde4c9f746eeed4b',
            },
            title: {
              type: 'string',
              example: 'My First Blog Post',
            },
            content: {
              type: 'string',
              example: 'This is the content of my first blog post.',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            headerImage: {
              type: 'string',
              example: '/uploads/1724408139576-Screenshot.png',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-08-23T10:15:39.616Z',
            },
          },
          required: ['_id', 'title', 'content', 'author'],
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply globally to all endpoints
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = setupSwaggerDocs;