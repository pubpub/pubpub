import ua from 'universal-analytics';

export default (uaCode)=> {
	const visitor = ua(uaCode, { https: true });
	function GAEventEmitter(options, emitted) {
		visitor.event(options.category, options.action, options.label, options.value, (err)=> { return emitted ? emitted(err) : null; });
	}
	return (req, res, next)=> {
		if (!req.headers['x-forwarded-for']) {
			req.headers['x-forwarded-for'] = '0.0.0.0';
		}
		visitor.pageview({
			dp: req.originalUrl,
			dr: req.get('Referer'),
			dh: req.hostname,
			ua: req.headers['user-agent'],
			ul: req.headers['accept-language'],
			uip: req.connection.remoteAddress
				|| req.socket.remoteAddress
				|| req.connection.remoteAddress
				|| req.headers['x-forwarded-for'].split(',').pop()
		}).send();
		req.ga = {
			event: GAEventEmitter
		};
		next();
	};
};
