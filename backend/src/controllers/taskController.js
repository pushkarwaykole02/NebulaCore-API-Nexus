import * as taskService from '../services/taskService.js';

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [todo, in_progress, done] }
 *     responses:
 *       201:
 *         description: Created
 */
export async function create(req, res, next) {
	try {
		const task = await taskService.createTask({
			userId: req.user.sub,
			title: req.body.title,
			description: req.body.description,
			status: req.body.status
		});
		res.status(201).json({ task });
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks with pagination and filters
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [todo, in_progress, done] }
 *     responses:
 *       200:
 *         description: OK
 */
export async function list(req, res, next) {
	try {
		const result = await taskService.listTasks({
			user: req.user,
			page: req.query.page,
			limit: req.query.limit,
			search: req.query.search,
			status: req.query.status
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 */
export async function getById(req, res, next) {
	try {
		const task = await taskService.getTask({ id: req.params.id, user: req.user });
		res.json({ task });
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [todo, in_progress, done] }
 *     responses:
 *       200:
 *         description: OK
 */
export async function update(req, res, next) {
	try {
		const task = await taskService.updateTask({ id: req.params.id, user: req.user, updates: req.body });
		res.json({ task });
	} catch (err) {
		next(err);
	}
}

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: No Content
 */
export async function remove(req, res, next) {
	try {
		await taskService.deleteTask({ id: req.params.id, user: req.user });
		res.status(204).send();
	} catch (err) {
		next(err);
	}
}

