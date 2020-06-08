import jwt from 'jsonwebtoken';
import app from '../server';

app.get(['/api/metabase/community/:community', '/api/metabase/pub/:pub'], (req, res) => {
	// This is the metabase dashboard ID. Eventually we may need a map of this. Defaults to community.
	let dashboard = 2;
	if (req.params.pub) {
		dashboard = 3;
	}
	const payload = {
		resource: { dashboard: dashboard },
		params: {
			...req.params,
		},
		exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
	};
	const token = jwt.sign(payload, process.env.METABASE_SECRET_KEY);

	return res.status(200).json({
		token: token,
	});
});
