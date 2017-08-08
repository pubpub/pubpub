import React from 'react';
import Helmet from 'react-helmet';

require('./noMatch.scss');

const NoMatch = function() {
	return (
		<div className={'.no-match'}>
			<Helmet title="Not Found · Site" />
			<h1>Page not found</h1>
		</div>
	);
};

export default NoMatch;
