import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../utils/env.js';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: env('SWAGGER_TITLE', 'NebulaCore API Nexus'),
			version: env('SWAGGER_VERSION', '1.0.0'),
			description: env('SWAGGER_DESCRIPTION', 'NebulaCore API Nexus - Swagger API documentation')
		},
		servers: [{ url: '/api/v1' }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		},
		security: [{ bearerAuth: [] }]
	},
	apis: ['src/routes/v1/*.js', 'src/controllers/*.js', 'src/schemas/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;

