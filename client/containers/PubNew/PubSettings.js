import React from 'react';
import PropTypes from 'prop-types';
import GridWrapper from 'components/GridWrapper/GridWrapper';
import { communityDataProps, locationDataProps, loginDataProps } from 'utilities/sharedPropTypes';
import { pubDataProps } from './sharedPropTypes';

const propTypes = {
	communityData: communityDataProps.isRequired,
	loginData: loginDataProps.isRequired,
	locationData: locationDataProps.isRequired,
	pubData: pubDataProps.isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const PubSettings = (props) => {
	return (
		<React.Fragment>
			<GridWrapper containerClassName="pub">
				<h1>Settings: {props.locationData.params.settingsMode || 'Details'}</h1>
			</GridWrapper>
		</React.Fragment>
	);
};

PubSettings.propTypes = propTypes;
export default PubSettings;
