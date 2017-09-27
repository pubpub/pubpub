import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';

require('./discussionPreviewArchived.scss');

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

	const sortedDiscussions = props.discussions.sort((foo, bar)=> {
		if (foo.createdAt > bar.createdAt) { return 1; }
		if (foo.createdAt < bar.createdAt) { return -1; }
		return 0;
	});

	const toUrl = props.isPresentation
		? `/pub/${props.slug}?thread=${props.discussions[0].threadNumber}`
		: `/pub/${props.slug}/collaborate?thread=${props.discussions[0].threadNumber}`;

	return (
		<Link className={'discussion-preview-archived'} to={toUrl}>
			<div className={'icons'}>
				{hasAttachments &&
					<span className={'pt-icon-standard pt-icon-paperclip'} />
				}
				{hasSuggestions &&
					<span className={'pt-icon-standard pt-icon-doc'} />
				}
				{hasHighlight &&
					<span className={'pt-icon-standard pt-icon-highlight'} />
				}
			</div>

			<div className={'title'}>{sortedDiscussions[0].title}</div>
			<div className={'detail'}>{sortedDiscussions.length - 1} Repl{sortedDiscussions.length - 1 === 1 ? 'y' : 'ies'}</div>

			<div className={'bottom-border'} />
		</Link>
	);
};

DiscussionPreviewArchived.propTypes = propTypes;
DiscussionPreviewArchived.defaultProps = defaultProps;
export default DiscussionPreviewArchived;
