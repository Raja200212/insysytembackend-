const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Website Electron API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Website Electron Node.js, Express & MySQL backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            is_admin: { type: 'integer' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            sale_price: { type: 'number' },
            image: { type: 'string' },
            stock: { type: 'integer' },
            category_id: { type: 'integer' },
            subcategory_id: { type: 'integer' },
            is_featured: { type: 'integer' },
            is_deal: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
          },
        },
        Subcategory: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            category_id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            product_id: { type: 'integer' },
            quantity: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'number' },
            sale_price: { type: 'number' },
            image: { type: 'string' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            product_id: { type: 'integer' },
            user_id: { type: 'integer' },
            rating: { type: 'integer' },
            comment: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            customer_name: { type: 'string' },
            phone: { type: 'string' },
            device_model: { type: 'string' },
            issue_description: { type: 'string' },
            status: { type: 'string' },
            tracking_token: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    phone: { type: 'string' },
                    address: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error or email already exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Log in an existing user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/profile': {
        get: {
          summary: 'Get active user profile',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/products': {
        get: {
          summary: 'Retrieve all products (with optional filtering)',
          tags: ['Products'],
          parameters: [
            { name: 'category_id', in: 'query', schema: { type: 'integer' }, description: 'Filter by category ID' },
            { name: 'subcategory_id', in: 'query', schema: { type: 'integer' }, description: 'Filter by subcategory ID' },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term for name/brand/description' },
            { name: 'is_featured', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filter featured products' },
            { name: 'is_deal', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filter deals products' },
            { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Limit results' },
          ],
          responses: {
            200: {
              description: 'List of active products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/products/{id}': {
        get: {
          summary: 'Get product by ID',
          tags: ['Products'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: {
              description: 'Product details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' },
                },
              },
            },
            404: { description: 'Product not found' },
          },
        },
      },
      '/api/categories': {
        get: {
          summary: 'Retrieve all categories',
          tags: ['Categories'],
          responses: {
            200: {
              description: 'List of categories',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/cart': {
        get: {
          summary: 'Get active shopping cart items',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Shopping cart items list',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CartItem' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add/update item in cart',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['product_id', 'quantity'],
                  properties: {
                    product_id: { type: 'integer' },
                    quantity: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cart updated successfully' },
          },
        },
      },
      '/api/services': {
        get: {
          summary: 'Get all service requests',
          tags: ['Services'],
          responses: {
            200: {
              description: 'List of service requests',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Service' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new service request',
          tags: ['Services'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['customer_name', 'phone', 'device_model', 'issue_description'],
                  properties: {
                    customer_name: { type: 'string' },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Service request created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Service' },
                },
              },
            },
          },
        },
      },
      '/api/health': {
        get: {
          summary: 'Health check route',
          tags: ['System'],
          responses: {
            200: {
              description: 'System health status',
            },
          },
        },
      },
    },
  },
  apis: [], // We list all specifications directly in config for robust loading
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
