import React from 'react';
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

const NoMatch = (props)=> {
	return (
		<div id="no-match-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
				hideFooter={true}
				hideNav={props.locationData.isBasePubPub}
			>
				<NonIdealState
					title="Page Not Found"
					visual="pt-icon-path-search"
				/>
			</PageWrapper>
		</div>
	);
};

NoMatch.propTypes = propTypes;
export default NoMatch;

hydrateWrapper(NoMatch);
