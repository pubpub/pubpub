import React from 'react';
import PropTypes from 'prop-types';
import DiscussionItem from './DiscussionItem';
import DiscussionInput from './DiscussionInput';

require('./discussionThread.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object.isRequired,
	threadData: PropTypes.array.isRequired,
	updateLocalData: PropTypes.func.isRequired,
	setActiveThread: PropTypes.func.isRequired,
	tempContextValues: PropTypes.object,
};

const defaultProps = {
	/* This is needed for the embedAddon */
	/* Remove this if/when we refactor the way */
	/* discussion embdeds work */
	tempContextValues: undefined,
};

const DiscussionThread = (props) => {
	const { pubData, threadData } = props;

	return (
		<div className="discussion-thread-component" tabIndex={-1}>
			{threadData
				.filter((item) => item.threadNumber)
				.map((item) => {
					return <DiscussionItem key={item.id} discussionData={item} {...props} />;
				})}
			{pubData.canDiscussBranch && <DiscussionInput key={threadData.length} {...props} />}
		</div>
	);
};

DiscussionThread.propTypes = propTypes;
DiscussionThread.defaultProps = defaultProps;
export default DiscussionThread;
