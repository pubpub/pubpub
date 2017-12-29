import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./noMatch.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	isBasePubPub: PropTypes.bool.isRequired,
};

class NoMatch extends Component {
	render() {
		return (
			<div id="no-match-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					isBasePubPub={this.props.isBasePubPub}
					hideFooter={true}
				>
					<NonIdealState
						title={'Page Not Found'}
						visual={'pt-icon-path-search'}
					/>
				</PageWrapper>
			</div>
		);
	}
}

NoMatch.propTypes = propTypes;
export default NoMatch;

hydrateWrapper(NoMatch);
