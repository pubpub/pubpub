import cheerio from 'cheerio';

export const defaultProcessor = ($el) => $el.attr('content') || $el.text().trim();

export const queryDocument = (config, $) => {
	let result;

	// Execute queries in order
	for (let i = 0; i < config.length; i++) {
		const query = config[i];

		let $el;
		let process;
		let multiple = false;

		if (typeof query === 'string') {
			// String form of query, e.g. "a.author"
			$el = $($(query).get(0));
		} else {
			// Object form of query, e.g.
			//   { selector: "a.author", process: $el => $el.attr("href") }
			$el = $(query.selector);

			// Process only first element by default.
			multiple = Boolean(query.multiple);

			if (!multiple) {
				$el = $($el.get(0));
			}

			process = query.process;
		}

		if (multiple || $el.length > 0) {
			// Use default processor if none is specified (content attr value or innerText)
			result = (process || defaultProcessor)($el, $);

			// Stop on first result
			if (result) {
				break;
			}
		}
	}

	return result || null;
};

export const pubEdgeQueries = {
	avatar: [
		'meta[property="og:image:secure_url"]',
		'meta[property="og:image"]',
		'meta[name="twitter:image"]',
		{ selector: 'article img, .abstract img', process: ($el) => $el.attr('src') },
	],
	contributors: [
		'meta[name="author"]',
		'meta[property="article:author"]',
		{
			selector: 'meta[name="dc.creator"]',
			process: ($el, $) => $el.toArray().map((el) => $(el).attr('content')),
			multiple: true,
		},
		{
			selector: '[rel="author"], .author',
			process: ($el, $) => $el.toArray().map((el) => $(el).text()),
			multiple: true,
		},
	],
	doi: [
		'meta[name="doi"]',
		{
			selector: 'meta[name="prism.doi"], meta[name="dc.identifier"]',
			process: ($el) => $el.attr('content').split('doi:')[1] || null,
		},
	],
	url: ['meta[property="og:url"]'],
	publicationDate: [
		{
			selector:
				'meta[property="article:published_time"], meta[name="dc.date"], meta[name="prism.publicationDate"]',
			process: ($el) => new Date(defaultProcessor($el)),
		},
		{
			selector: 'time, .date',
			process: ($el) => new Date(defaultProcessor($el)),
		},
	],
	title: ['meta[property="og:title"]', 'meta[name="dc.title"]'],
	description: [
		'meta[name="description"]',
		'meta[property="og:description"]',
		'meta[name="dc.description"]',
	],
};

export const runQueries = async (queries, response) => {
	const text = await response.text();
	const $ = cheerio.load(text);

	return Object.entries(queries).reduce((results, [key, query]) => {
		return { ...results, [key]: queryDocument(query, $) };
	}, {});
};
