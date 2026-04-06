const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
        url: 'https://todo-api-30yz.onrender.com/',
        description: 'Render',
      },
      {
        url: 'https://todo-api-production-be35.up.railway.app',
        description: 'Railway',
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
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            important: { type: 'boolean' },
            tags: {
              type: 'array',
              items: { type: 'string' },
            },
            date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            done: { type: 'boolean' },
            parentTask: {
              type: 'string',
              nullable: true,
            },
            userId: { type: 'string' },
          },
        },

        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              default: 'medium',
            },
            important: {
              type: 'boolean',
              default: false,
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
            },
            date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            parentTask: {
              type: 'string',
              nullable: true,
            },
          },
        },

        TaskTree: {
          allOf: [
            { $ref: '#/components/schemas/Task' },
            {
              type: 'object',
              properties: {
                subtasks: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/TaskTree',
                  },
                },
              },
            },
          ],
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

        Message: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },

        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;