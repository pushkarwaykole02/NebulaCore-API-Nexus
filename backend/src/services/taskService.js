import { supabase } from '../config/supabase.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { v4 as uuidv4 } from 'uuid';

const TASKS_TABLE = 'tasks';

export async function createTask({ userId, title, description = '', status = 'todo' }) {
	const id = uuidv4();
	const cleanTitle = sanitizeInput(title);
	const cleanDescription = sanitizeInput(description);
	const { data, error } = await supabase
		.from(TASKS_TABLE)
		.insert([{ id, title: cleanTitle, description: cleanDescription, status, user_id: userId }])
		.select('*')
		.single();
	if (error) throw error;
	return data;
}

export async function listTasks({ user, page = 1, limit = 10, search, status }) {
	const p = Number(page) || 1;
	const l = Math.min(Number(limit) || 10, 100);
	const from = (p - 1) * l;
	const to = from + l - 1;
	let query = supabase.from(TASKS_TABLE).select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
	if (user.role !== 'admin') {
		query = query.eq('user_id', user.sub);
	}
	if (status) {
		query = query.eq('status', status);
	}
	if (search) {
		const s = sanitizeInput(search);
		query = query.ilike('title', `%${s}%`);
	}
	const { data, error, count } = await query;
	if (error) throw error;
	return { data, pagination: { page: p, limit: l, total: count || 0 } };
}

export async function getTask({ id, user }) {
	let query = supabase.from(TASKS_TABLE).select('*').eq('id', id).single();
	if (user.role !== 'admin') {
		query = query.eq('user_id', user.sub);
	}
	const { data, error } = await query;
	if (error) throw error;
	return data;
}

export async function updateTask({ id, user, updates }) {
	const clean = {};
	if (updates.title !== undefined) clean.title = sanitizeInput(updates.title);
	if (updates.description !== undefined) clean.description = sanitizeInput(updates.description);
	if (updates.status !== undefined) clean.status = updates.status;
	let query = supabase.from(TASKS_TABLE).update(clean).eq('id', id).select('*').single();
	if (user.role !== 'admin') {
		query = query.eq('user_id', user.sub);
	}
	const { data, error } = await query;
	if (error) throw error;
	return data;
}

export async function deleteTask({ id, user }) {
	let query = supabase.from(TASKS_TABLE).delete().eq('id', id).select('id').single();
	if (user.role !== 'admin') {
		query = query.eq('user_id', user.sub);
	}
	const { data, error } = await query;
	if (error) throw error;
	return data;
}

