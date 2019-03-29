import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PubDiscussionThread from './PubDiscussionThread';
import PubDiscussionThreadNew from './PubDiscussionThreadNew';

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object.isRequired,
};

const PubDiscussions = (props) => {
	const { pubData, collabData, firebaseBranchRef } = props;
	const decorations = collabData.editorChangeObject.decorations || [];
	const discussionIds = decorations
		.filter((decoration) => {
			const attrs = decoration.attrs || {};
			const className = attrs.class || '';
			return className.indexOf('discussion-range d-') > -1;
		})
		.map((decoration) => {
			const attrs = decoration.attrs || {};
			const className = attrs.class || '';
			const id = className.replace('discussion-range d-', '');
			return id;
		});

	const newDiscussionIds = decorations
		.filter((decoration) => {
			const attrs = decoration.attrs || {};
			const className = attrs.class || '';
			return className.indexOf('local-highlight lh-') > -1;
		})
		.map((decoration) => {
			const attrs = decoration.attrs || {};
			const className = attrs.class || '';
			const id = className.replace('local-highlight lh-', '');
			return id;
		});

	const [discussionsState, discussionsDispatch] = useReducer((state, action) => {
		if (action.delete) {
			const newState = { ...state };
			delete newState[action.id];
			return newState;
		}
		return {
			...state,
			[action.id]: {
				...state[action.id],
				[action.key]: action.value,
			},
		};
	}, {});

	return (
		<div className="pub-discussions-component">
			{discussionIds
				.filter((id) => {
					return document && document.getElementsByClassName(`dm-${id}`)[0];
				})
				.map((id) => {
					return ReactDOM.createPortal(
						<PubDiscussionThread
							pubData={pubData}
							collabData={collabData}
							firebaseBranchRef={firebaseBranchRef}
							discussionId={id}
							discussionState={discussionsState[id] || {}}
							dispatch={discussionsDispatch}
						/>,
						document.getElementsByClassName(`dm-${id}`)[0],
					);
				})}
			{newDiscussionIds
				.filter((id) => {
					return document && document.getElementsByClassName(`lm-${id}`)[0];
				})
				.map((id) => {
					return ReactDOM.createPortal(
						<PubDiscussionThreadNew
							pubData={pubData}
							collabData={collabData}
							firebaseBranchRef={firebaseBranchRef}
							discussionId={id}
							discussionState={discussionsState[id] || {}}
							dispatch={discussionsDispatch}
						/>,
						document.getElementsByClassName(`lm-${id}`)[0],
					);
				})}
		</div>
	);
};

PubDiscussions.propTypes = propTypes;
export default PubDiscussions;
