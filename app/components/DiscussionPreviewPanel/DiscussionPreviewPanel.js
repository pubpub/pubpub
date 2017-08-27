import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';

require('./discussionPreviewPanel.scss');

const propTypes = {
	threads: PropTypes.array.isRequired,
	slug: PropTypes.string.isRequired,
};

const DiscussionPreviewPanel = function(props) {
	return (
		<div className={'discussion-preview-panel'}>
			{props.threads.map((thread)=> {
				return (
					<Link to={`/pub/${props.slug}/collaborate?thread=${thread[0].threadNumber}`} key={`thread-${thread[0].id}`} className={'thread'}>
						<DiscussionPreview discussions={thread} />
					</Link>
				);
			})}
		</div>
	);
};

DiscussionPreviewPanel.propTypes = propTypes;
export default DiscussionPreviewPanel;
