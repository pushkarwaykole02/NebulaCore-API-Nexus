export function validate(schema) {
	return (req, res, next) => {
		const data = { body: req.body, query: req.query, params: req.params };
		const result = schema.safeParse(data);
		if (!result.success) {
			return res.status(400).json({
				message: 'Validation failed',
				details: result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
			});
		}
		req.body = result.data.body;
		req.query = result.data.query;
		req.params = result.data.params;
		next();
	};
}

