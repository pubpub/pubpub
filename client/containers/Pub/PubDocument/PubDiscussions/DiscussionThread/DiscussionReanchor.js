import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import {
	convertLocalHighlightToDiscussion,
	setLocalHighlight,
	removeLocalHighlight,
	forceRemoveDiscussionHighlight,
} from '@pubpub/editor';
import { Button, ButtonGroup, Card, Icon, Tooltip } from '@blueprintjs/core';

require('./discussionReanchor.scss');

const propTypes = {
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object.isRequired,
	discussionId: PropTypes.string.isRequired,
};

const DiscussionReanchor = (props) => {
	const { collabData, discussionId, firebaseBranchRef } = props;
	const [isActive, setIsActive] = useState(false);
	const [isInProgress, setIsInProgress] = useState(false);
	const cleanupFn = useRef(null);
	const { selection } = collabData.editorChangeObject;

	const onReanchor = () => {
		const { view } = collabData.editorChangeObject;
		const highlightId = uuid.v4();
		setLocalHighlight(view, selection.from, selection.to, highlightId);
		setIsInProgress(true);
		forceRemoveDiscussionHighlight(view, discussionId);
		convertLocalHighlightToDiscussion(view, highlightId, discussionId, firebaseBranchRef).then(
			() => {
				if (cleanupFn.current) {
					cleanupFn.current();
				}
				removeLocalHighlight(view, highlightId);
			},
		);
	};

	useEffect(() => {
		cleanupFn.current = () => {
			setIsInProgress(false);
			setIsActive(false);
		};
	}, []);

	useEffect(
		() => () => {
			cleanupFn.current = null;
		},
		[],
	);

	return (
		<React.Fragment>
			<Tooltip content="Re-anchor discussion">
				<Button
					small
					minimal
					disabled={isActive}
					onClick={() => setIsActive(true)}
					icon={<Icon icon="text-highlight" iconSize={12} />}
				/>
			</Tooltip>
			{isActive &&
				ReactDOM.createPortal(
					<Card className="discussion-reanchor-component">
						<p>Make a highlight in the document and then click "Re-anchor".</p>
						<ButtonGroup>
							<Button onClick={() => setIsActive(false)} style={{ marginRight: 10 }}>
								Cancel
							</Button>
							<Button
								onClick={onReanchor}
								disabled={!selection || selection.empty}
								loading={isInProgress}
								intent="primary"
							>
								Re-anchor
							</Button>
						</ButtonGroup>
					</Card>,
					document.querySelector('body'),
				)}
		</React.Fragment>
	);
};

DiscussionReanchor.propTypes = propTypes;
export default DiscussionReanchor;
