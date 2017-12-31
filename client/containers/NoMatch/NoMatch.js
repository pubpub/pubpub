import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./noMatch.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class NoMatch extends Component {
	render() {
		return (
			<div id="no-match-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					<NonIdealState
						title="Page Not Found"
						visual="pt-icon-path-search"
					/>
				</PageWrapper>
			</div>
		);
	}
}

NoMatch.propTypes = propTypes;
export default NoMatch;

hydrateWrapper(NoMatch);
