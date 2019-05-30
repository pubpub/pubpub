import React from 'react';
import PropTypes from 'prop-types';
import { communityDataProps, locationDataProps, loginDataProps } from 'types/base';
import { pubDataProps } from 'types/pub';
import { GridWrapper } from 'components';

const propTypes = {
	pubData: pubDataProps.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.func.isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const PubSubmission = (props) => {
	const sourceBranch = 0;
	const destinationBranch = 0;
	// Get branches
	// Give their names
	// Test if it is a 'push' or a 'submit'
	// 
	return (
		<GridWrapper containerClassName="pub pub-branch-create-component">
			<h1>Submission</h1>
		</GridWrapper>
	);
};

PubSubmission.propTypes = propTypes;
export default PubSubmission;
