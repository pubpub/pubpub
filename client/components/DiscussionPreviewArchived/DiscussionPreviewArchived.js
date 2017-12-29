import React from 'react';
import PropTypes from 'prop-types';

if (typeof require.ensure === 'function') {
	require('./discussionPreviewArchived.scss');
}

const propTypes = {
	discussions: PropTypes.array.isRequired,
	slug: PropTypes.string.isRequired,
	isPresentation: PropTypes.bool,
};

const defaultProps = {
	isPresentation: false,
};

const DiscussionPreviewArchived = function(props) {
	const hasAttachments = props.discussions.reduce((prev, curr)=> {
		return prev || curr.attachments;
	}, false);
	const hasSuggestions = props.discussions.reduce((prev, curr)=> {
		return prev || curr.suggestions;
	}, false);
	const hasHighlight = props.discussions.reduce((prev, curr)=> {
		return prev || curr.highlight;
	}, false);
	let submissionStatus = '';
	const hasSubmission = props.discussions.reduce((prev, curr)=> {
		if (curr.submitHash && curr.submitApprovedAt) { submissionStatus = 'pt-intent-success'; }
		if (curr.submitHash && curr.isArchived && !curr.submitApprovedAt) { submissionStatus = 'pt-intent-danger'; }
		return prev || curr.submitHash;
	}, false);
	const isPublic = props.discussions.reduce((prev, curr)=> {
		return prev || curr.isPublic;
	}, false);

	const sortedDiscussions = props.discussions.sort((foo, bar)=> {
		if (foo.createdAt > bar.createdAt) { return 1; }
		if (foo.createdAt < bar.createdAt) { return -1; }
		return 0;
	});

	const toUrl = props.isPresentation
		? `/pub/${props.slug}?thread=${props.discussions[0].threadNumber}`
		: `/pub/${props.slug}/collaborate?thread=${props.discussions[0].threadNumber}`;

	return (
		<a href={toUrl} className="discussion-preview-archived-component">
			<div className="icons">
				{hasAttachments &&
					<span className="pt-icon-standard pt-icon-paperclip" />
				}
				{hasSuggestions &&
					<span className="pt-icon-standard pt-icon-doc" />
				}
				{hasHighlight &&
					<span className="pt-icon-standard pt-icon-highlight" />
				}
				{hasSubmission &&
					<span className={`pt-icon-standard pt-icon-endorsed ${submissionStatus}`} />
				}
			</div>

			<div className="title">
				{sortedDiscussions[0].title}
				{!isPublic && <span className="pt-icon-standard pt-icon-lock2" />}
			</div>
			<div className="detail">{sortedDiscussions.length - 1} Repl{sortedDiscussions.length - 1 === 1 ? 'y' : 'ies'}</div>

			<div className="bottom-border" />
		</a>
	);
};

DiscussionPreviewArchived.propTypes = propTypes;
DiscussionPreviewArchived.defaultProps = defaultProps;
export default DiscussionPreviewArchived;
