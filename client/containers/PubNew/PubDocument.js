import React from 'react';
import PropTypes from 'prop-types';
import { communityDataProps, locationDataProps, loginDataProps } from 'utilities/sharedPropTypes';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubBody from './PubBody';
import PubFooter from './PubFooter';
import { pubDataProps } from './sharedPropTypes';

const propTypes = {
	communityData: communityDataProps.isRequired,
	loginData: loginDataProps.isRequired,
	locationData: locationDataProps.isRequired,
	pubData: pubDataProps.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.func.isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const PubDocument = (props) => {
	return (
		<React.Fragment>
			<PubHeaderFormatting
				loginData={props.loginData}
				pubData={props.pubData}
				collabData={props.collabData}
			/>
			<PubBody
				locationData={props.locationData}
				communityData={props.communityData}
				loginData={props.loginData}
				pubData={props.pubData}
				collabData={props.collabData}
				firebaseBranchRef={props.firebaseBranchRef}
				updateLocalData={props.updateLocalData}
			/>
			<PubFooter pubData={props.pubData} />
			{/* <PubDiscussions pubData={pubData} /> */}
		</React.Fragment>
	);
};

PubDocument.propTypes = propTypes;
export default PubDocument;
