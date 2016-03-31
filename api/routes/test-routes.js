const app = require('../api');

export function getEcho(req, res) {
	res.status(201).json(req.query);
}
app.get('/getEcho', getEcho);

export function postEcho(req, res) {
	res.status(201).json(req.body);
}
app.post('/postEcho', postEcho);
