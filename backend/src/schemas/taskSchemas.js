import { z } from 'zod';

export const createTaskSchema = z.object({
	body: z.object({
		title: z.string().min(1),
		description: z.string().optional().default(''),
		status: z.enum(['todo', 'in_progress', 'done']).optional().default('todo')
	}),
	query: z.object({}),
	params: z.object({})
});

export const updateTaskSchema = z.object({
	body: z.object({
		title: z.string().min(1).optional(),
		description: z.string().optional(),
		status: z.enum(['todo', 'in_progress', 'done']).optional()
	}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' }),
	query: z.object({}),
	params: z.object({
		id: z.string().uuid()
	})
});

export const listTasksSchema = z.object({
	body: z.object({}),
	query: z.object({
		page: z.string().optional(),
		limit: z.string().optional(),
		search: z.string().optional(),
		status: z.enum(['todo', 'in_progress', 'done']).optional()
	}),
	params: z.object({})
});

export const taskIdSchema = z.object({
	body: z.object({}),
	query: z.object({}),
	params: z.object({
		id: z.string().uuid()
	})
});

