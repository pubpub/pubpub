import ua from 'universal-analytics';

export default (req)=> {
	if (req.hostname !== 'dev.pubpub.org') {
		const uaCode = 'UA-61723493-6';
		const visitor = ua(uaCode, { https: true });
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
	}
};
