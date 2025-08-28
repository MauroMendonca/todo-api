const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { collection } = require('../models/Tag');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'ToDo API',
        version: '1.0.0',
        description: 'API documentation for the ToDo application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
      {
        url: 'https://todo-api-production-be35.up.railway.app',
        description: 'Production Server (Railway)',
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
      schemas: {
        Task: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the task',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priority of the task',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the task',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Due date of the task',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who created the task',
            },
          },
          required: ['title', 'userId'],
        },
      tasksArray: {
          type: 'object',
          required: ['tasks'],
          properties: {
            tasks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Task',
              },
            },
          },
        },
      Tag: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the tag',
            },
            color: {
              type: 'string',
              description: 'Color associated with the tag',
            },
            emoji: {
              type: 'string',
              description: 'Emoji associated with the tag',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who created the tag',
            },
          },
          required: ['name', 'userId'],
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
          required: ['message'],
        },
        Message: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Response message',
            },
          },
          required: ['message'],
        },
      },
    },
    security: [{ bearerAuth: [] }],
},
  apis: ['./src/routes/*.js', './controllers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;