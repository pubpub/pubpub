import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';

require('./discussionNew.scss');

const propTypes = {
	pubId: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	loginData: PropTypes.object,
	pathname: PropTypes.string.isRequired,
	handleDiscussionSubmit: PropTypes.func.isRequired,
};
const defaultProps = {
	loginData: {},
};

const DiscussionNew = function(props) {
	function onDiscussionSubmit(replyObject) {
		props.handleDiscussionSubmit({
			userId: props.loginData.id,
			pubId: props.pubId,
			title: replyObject.title,
			content: replyObject.content,
			text: replyObject.text,
		});
	}

	return (
		<div className={'discussion-new'}>
			<Link to={`/pub/${props.slug}/collaborate`} className={'top-button pt-button pt-minimal'}>
				Cancel
			</Link>

			{!props.loginData.id &&
				<div className={'login-wrapper'}>
					<Link to={`/login?redirect=${props.pathname}`} className={'pt-button pt-fill'}>
						Login to Reply
					</Link>
				</div>
			}

			<div className={props.loginData.id ? '' : 'disabled'}>
				<DiscussionInput
					handleSubmit={onDiscussionSubmit}
					showTitle={true}
				/>
			</div>

		</div>
	);
};

DiscussionNew.propTypes = propTypes;
DiscussionNew.defaultProps = defaultProps;
export default DiscussionNew;
