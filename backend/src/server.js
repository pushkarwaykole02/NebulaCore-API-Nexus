import { createServer } from 'http';
import app from './app.js';
import logger from './utils/logger.js';
import { env } from './utils/env.js';

const port = Number(env('PORT', '4000'));

const server = createServer(app);

server.listen(port, () => {
	logger.info(`NebulaCore API Nexus listening on port ${port}`);
});

