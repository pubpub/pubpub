import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Editor from '@pubpub/editor';
import { Button } from '@blueprintjs/core';

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
};

const DiscussionThread = (props) => {
	const { discussionId, discussionState, dispatch } = props;
	const { isOpen, editorState } = discussionState;

	return (
		<React.Fragment>
			<Button
				style={{
					position: 'absolute',
					left: '100%',
				}}
				icon="swap-vertical"
				onClick={() => {
					dispatch({ id: discussionId, key: 'isOpen', value: !isOpen });
				}}
			/>
			{isOpen && (
				<div className="bp3-card bp3-elevation-2">
					<Editor
						placeholder="Begin writing here..."
						// This calls .toJSON everytime which seems inefficient
						// Why do we only need this for local changes to doc - and not remote edits?
						initialContent={
							editorState && editorState.doc ? editorState.doc.toJSON() : undefined
						}
						onChange={(editorChangeObject) => {
							dispatch({
								id: discussionId,
								key: 'editorState',
								value: editorChangeObject.view.state,
							});
						}}
					/>
				</div>
			)}
		</React.Fragment>
	);
};

const PubDiscussions = (props) => {
	const decorations = props.collabData.editorChangeObject.decorations || [];
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

	const [discussionsState, discussionsDispatch] = useReducer((state, action) => {
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
						<DiscussionThread
							discussionId={id}
							discussionState={discussionsState[id] || {}}
							dispatch={discussionsDispatch}
						/>,
						document.getElementsByClassName(`dm-${id}`)[0],
					);
				})}
		</div>
	);
};

PubDiscussions.propTypes = propTypes;
export default PubDiscussions;
