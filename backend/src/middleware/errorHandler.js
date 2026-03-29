import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
	logger.error(err.stack || err.message || err);
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	const details = err.details || undefined;
	res.status(status).json({ message, details });
}

