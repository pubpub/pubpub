import React from 'react';
import PropTypes from 'prop-types';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';

require('./discussionNew.scss');

const propTypes = {
	pubId: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	loginData: PropTypes.object,
	initialContent: PropTypes.object,
	getHighlightContent: PropTypes.func,
	pathname: PropTypes.string.isRequired,
	handleDiscussionSubmit: PropTypes.func.isRequired,
	submitIsLoading: PropTypes.bool,
	setThread: PropTypes.func.isRequired,
};
const defaultProps = {
	initialContent: undefined,
	getHighlightContent: undefined,
	loginData: {},
	submitIsLoading: false,
};

const DiscussionNew = function(props) {
	function onDiscussionSubmit(replyObject) {
		props.handleDiscussionSubmit({
			userId: props.loginData.id,
			pubId: props.pubId,
			title: replyObject.title,
			content: replyObject.content,
			text: replyObject.text,
			isPublic: replyObject.isPublic,
			highlights: replyObject.highlights,
		});
	}

	return (
		<div className="discussion-new-component">
			<a
				// href={`/pub/${props.slug}/collaborate`}
				onClick={()=> { props.setThread(undefined); }}
				className="top-button pt-button pt-minimal"
			>
				Cancel
			</a>

			{!props.loginData.id &&
				<div className="login-wrapper">
					<a href={`/login?redirect=${props.pathname}`} className="pt-button pt-fill">
						Login to Add Discussion
					</a>
				</div>
			}

			<div className={props.loginData.id ? '' : 'disabled'}>
				<DiscussionInput
					initialContent={props.initialContent}
					handleSubmit={onDiscussionSubmit}
					showTitle={true}
					submitIsLoading={props.submitIsLoading}
					getHighlightContent={props.getHighlightContent}
				/>
			</div>

		</div>
	);
};

DiscussionNew.propTypes = propTypes;
DiscussionNew.defaultProps = defaultProps;
export default DiscussionNew;
