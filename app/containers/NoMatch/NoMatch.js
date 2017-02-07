import React from 'react';
import Helmet from 'react-helmet';

export const NoMatch = React.createClass({

	render() {
		return (
			<div>
				<Helmet title="Not Found · PubPub" />
				Page was not found
			</div>
		);
	}
});

export default NoMatch;
