import * as authService from '../services/authService.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: Created
 */
export async function register(req, res, next) {
	try {
		const user = await authService.registerUser(req.body);
		res.status(201).json({ user });
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
export async function login(req, res, next) {
	try {
		const result = await authService.loginUser(req.body);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
export async function refresh(req, res, next) {
	try {
		const tokens = await authService.refreshToken(req.body);
		res.json(tokens);
	} catch (err) {
		next(err);
	}
}

