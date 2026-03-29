import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

const accessSecret = env('JWT_ACCESS_SECRET');

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ message: 'Missing token' });
	try {
		const payload = jwt.verify(token, accessSecret);
		req.user = payload;
		next();
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

export function authorize(roles = []) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (roles.length && !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next();
	};
}

