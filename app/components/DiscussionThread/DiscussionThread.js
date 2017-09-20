import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';

require('./discussionThread.scss');

const propTypes = {
	discussions: PropTypes.array.isRequired,
	slug: PropTypes.string.isRequired,
	loginData: PropTypes.object,
	pathname: PropTypes.string.isRequired,
	handleReplySubmit: PropTypes.func.isRequired,
};
const defaultProps = {
	loginData: {},
};

const DiscussionThread = function(props) {
	const sortedDiscussions = props.discussions.sort((foo, bar)=> {
		if (foo.createdAt > bar.createdAt) { return 1; }
		if (foo.createdAt < bar.createdAt) { return -1; }
		return 0;
	});
	const canAdminThread =
		sortedDiscussions[0].userId === props.loginData.id || // User is author of thread
		props.loginData.canAdmin; // User has pub-level admin permissions

	function onReplySubmit(replyObject) {
		props.handleReplySubmit({
			userId: props.loginData.id,
			threadNumber: props.discussions[0].threadNumber,
			pubId: props.discussions[0].pubId,
			content: replyObject.content,
			text: replyObject.text
		});
	}

	return (
		<div className={'discussion-thread'}>
			<Link to={`/pub/${props.slug}/collaborate`} className={'top-button pt-button pt-minimal'}>
				Show all threads
			</Link>

			{canAdminThread &&
				<div className={'thread-buttons pt-button-group pt-minimal pt-small'}>
					<button type={'button'} className={'pt-button pt-icon-edit2'} />
					<button type={'button'} className={'pt-button pt-icon-compressed'} />
				</div>
			}

			<div className={'title'}>{sortedDiscussions[0].title}</div>
			<div>
				{sortedDiscussions.map((discussion)=> {
					return (
						<div className={'discussion'} key={`discussion-${discussion.id}`}>

							<div className={'item-header'}>
								<Link to={`/user/${discussion.author.slug}`}>
									<Avatar
										width={30}
										userInitials={discussion.author.initials}
										userAvatar={discussion.author.avatar}
									/>
								</Link>

								<div className={'details'}>
									<div className={'name'}>
										<Link to={`/user/${discussion.author.slug}`}>{discussion.author.fullName || discussion.author.userInitials}</Link>
									</div>
									<TimeAgo date={discussion.createdAt} className={'date'} />
								</div>

								<div className={'pt-button-group pt-minimal pt-small'}>
									{discussion.userId === props.loginData.id &&
										<button type={'button'} className={'pt-button pt-icon-edit2'} />
									}

									<DropdownButton icon={'pt-icon-more'} isRightAligned={true}>
										<div className={'pt-menu'}>
											<div className="pt-menu-item pt-popover-dismiss">
												Flag
											</div>
											<div className="pt-menu-item pt-popover-dismiss">
												Link To...
											</div>
										</div>
									</DropdownButton>
								</div>

							</div>

							<div className={'text'}>{discussion.text}</div>

						</div>
					);
				})}
			</div>

			{props.loginData.id
				? <DiscussionInput handleSubmit={onReplySubmit} />
				: <Link to={`/login?redirect=${props.pathname}`} className={'pt-button pt-fill'}>
					Login to Reply
				</Link>
			}
		</div>
	);
};

DiscussionThread.propTypes = propTypes;
DiscussionThread.defaultProps = defaultProps;
export default DiscussionThread;
