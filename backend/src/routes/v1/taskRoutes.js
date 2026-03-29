import { Router } from 'express';
import * as taskController from '../../controllers/taskController.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from '../../schemas/taskSchemas.js';

const router = Router();

router.post('/', authenticate, validate(createTaskSchema), taskController.create);
router.get('/', authenticate, validate(listTasksSchema), taskController.list);
router.get('/:id', authenticate, validate(taskIdSchema), taskController.getById);
router.patch('/:id', authenticate, validate(updateTaskSchema), taskController.update);
router.delete('/:id', authenticate, validate(taskIdSchema), taskController.remove);

export default router;

