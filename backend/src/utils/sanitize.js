import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(value) {
	if (value === undefined || value === null) return value;
	if (typeof value !== 'string') return value;
	return sanitizeHtml(value, {
		allowedTags: [],
		allowedAttributes: {}
	});
}

