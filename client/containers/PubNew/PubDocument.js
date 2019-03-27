import React from 'react';
import PropTypes from 'prop-types';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubBody from './PubBody';
import PubFooter from './PubFooter';
import { pubDataProps } from './sharedPropTypes';

const propTypes = {
	pubData: pubDataProps.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object,
	updateLocalData: PropTypes.func.isRequired,
};

const defaultProps = {
	firebaseBranchRef: undefined,
};

const PubDocument = (props) => {
	return (
		<React.Fragment>
			<PubHeaderFormatting pubData={props.pubData} collabData={props.collabData} />
			<PubBody
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
PubDocument.defaultProps = defaultProps;
export default PubDocument;
