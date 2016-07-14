const app = require('../api');

export function femi(req, res) {
	return res.status(201).json({
		output: req.body.input.toUpperCase()
	});
}
app.post('/femi', femi);