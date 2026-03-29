import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';
import { generateTokens, verifyRefreshToken } from './tokenService.js';
import { env } from '../utils/env.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { v4 as uuidv4 } from 'uuid';

const USERS_TABLE = 'users';
const SALT_ROUNDS = 10;

export async function registerUser({ email, password }) {
	const cleanEmail = sanitizeInput(email).toLowerCase();
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	const id = uuidv4();
	const { data, error } = await supabase
		.from(USERS_TABLE)
		.insert([{ id, email: cleanEmail, password: passwordHash, role: 'user' }])
		.select('id, email, role')
		.single();
	if (error) {
		if (error.message?.toLowerCase().includes('duplicate') || error.code === '23505') {
			const e = new Error('Email already registered');
			e.status = 409;
			throw e;
		}
		throw error;
	}
	return data;
}

export async function loginUser({ email, password }) {
	const cleanEmail = sanitizeInput(email).toLowerCase();
	const { data: user, error } = await supabase
		.from(USERS_TABLE)
		.select('id, email, password, role')
		.eq('email', cleanEmail)
		.single();
	if (error || !user) {
		const e = new Error('Invalid credentials');
		e.status = 401;
		throw e;
	}
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		const e = new Error('Invalid credentials');
		e.status = 401;
		throw e;
	}
	const payload = { sub: user.id, email: user.email, role: user.role };
	const tokens = generateTokens(payload);
	return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
}

export async function refreshToken({ refreshToken }) {
	try {
		const payload = verifyRefreshToken(refreshToken);
		const tokens = generateTokens({ sub: payload.sub, email: payload.email, role: payload.role });
		return tokens;
	} catch {
		const e = new Error('Invalid refresh token');
		e.status = 401;
		throw e;
	}
}

