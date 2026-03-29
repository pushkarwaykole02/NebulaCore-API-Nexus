import dotenv from 'dotenv';
dotenv.config();

export function env(key, defaultValue) {
	const value = process.env[key];
	if (value === undefined || value === null || value === '') {
		return defaultValue;
	}
	return value;
}

