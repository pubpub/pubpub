import React from 'react';
import Helmet from 'react-helmet';
import { NonIdealState } from '@blueprintjs/core';

require('./noMatch.scss');

const NoMatch = function() {
	return (
		<div className={'no-match'}>
			<Helmet title="Not Found" />

			<NonIdealState
				title={'Page Not Found'}
				visual={'pt-icon-path-search'}
			/>
		</div>
	);
};

export default NoMatch;
