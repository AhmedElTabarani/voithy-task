const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSchemas = require('./swaggerSchemas');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    components: {
      schemas: swaggerSchemas,
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],

    info: {
      title: 'Voithy Project',
      version: '0.1.0',
      description: 'Voithy Project',
    },
    basePath: '/api',
    host: 'https://cloudy-plum-tights.cyclic.app/',
    servers: [
      {
        url: 'https://cloudy-plum-tights.cyclic.app/',
      },
      {
        url: 'http://locahost:3030/',
      },
    ],
    tags: [
      {
        name: 'Doctor',
        description: 'Doctor Operations',
      },
      {
        name: 'Patient',
        description: 'Patient Operations',
      },
      {
        name: 'Record',
        description: 'Record Operations',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
