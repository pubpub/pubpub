import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

if (typeof require.ensure === 'function') {
	require('./collection.scss');
}

const propTypes = {
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	isBasePubPub: PropTypes.bool.isRequired,
};

class Collection extends Component {
	render() {
		return (
			<div id="collection-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					isBasePubPub={this.props.isBasePubPub}
				>
					<h1>Content Content</h1>
				</PageWrapper>
			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default Collection;

hydrateWrapper(Collection);
