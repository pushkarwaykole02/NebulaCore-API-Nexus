import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

const accessSecret = env('JWT_ACCESS_SECRET');
const refreshSecret = env('JWT_REFRESH_SECRET');
const accessExpiresIn = env('JWT_ACCESS_EXPIRES', '15m');
const refreshExpiresIn = env('JWT_REFRESH_EXPIRES', '7d');

export function generateTokens(payload) {
	const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
	const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
	return { accessToken, refreshToken };
}

export function verifyRefreshToken(token) {
	return jwt.verify(token, refreshSecret);
}

