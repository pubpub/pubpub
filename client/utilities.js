import React from 'react';
import { hydrate } from 'react-dom';

export const hydrateWrapper = (Component)=> {
	if (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:9001') {
		const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
		hydrate(<Component {...initialData} />, document.getElementById('root'));
	}
};

export const getResizedUrl = function(url, type, dimensions) {
	if (!url || url.indexOf('https://assets.pubpub.org/') === -1) { return url; }
	const extension = url.split('.').pop().toLowerCase();
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
	if (validExtensions.indexOf(extension) === -1) { return 'url'; }

	const prefix = type ? `${type}/` : '';
	return `https://jake.pubpub.org/unsafe/${prefix}${dimensions}/${url}`;

	/* jake.pubpub.org is our original resizing service */
	/* hosted on Heroku with .gif support. More expensive, but works. */
	/* Unsure of how well it scales since its caching is memory-based */
	/* jakejr.pubpub.org is an AWS cloudformation distribution. */
	/* http://docs.aws.amazon.com/solutions/latest/serverless-image-handler/welcome.html */
	/* It does not have .gif support, but should scale much better */
	/* and saves its cache on cloudfront */

	/* Since originally writing that, two things have been noticed */
	/* 1: jake.pubpub.org goes through Cloudflare, so should cache okay */
	/* 2: The AWS instance seems to have a lot of artifacting, and is tough to control */
	/* Since the cost and speeds aren't an issue at the moment, lets go with the 'more expensive' */
	/* jake.pubpub.org for all images until we have more time to dedicate to this */

	// if (extension === 'gif') {
	// 	return `https://jake.pubpub.org/unsafe/${prefix}${dimensions}/${url}`;
	// }
	// const filepath = url.replace('https://assets.pubpub.org/', '');
	// return `https://jakejr.pubpub.org/${prefix}${dimensions}/${filepath}`;
};
