import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';

require('./discussionThread.scss');

const propTypes = {
	discussions: PropTypes.array.isRequired,
};

const DiscussionThread = function(props) {

	const sortedDiscussions = props.discussions.sort((foo, bar)=> {
		if (foo.date > bar.date) { return 1; }
		if (foo.date < bar.date) { return -1; }
		return 0;
	});

	return (
		<div className={'discussion-thread'}>
			<div className={'title'}>{sortedDiscussions[0].title}</div>

			<div>
				{sortedDiscussions.map((discussion)=> {
					return (
						<div className={'discussion'} key={`discussion-${discussion.id}`}>

							<div className={'item-header'}>
								<Avatar
									width={30}
									userInitials={discussion.author.userInitials}
									userAvatar={discussion.author.userAvatar}
								/>
								<div className={'details'}>
									<Link to={`/user/${discussion.author.slug}`} className={'name'}>{discussion.author.fullName || discussion.author.userInitials}</Link>
									<TimeAgo date={discussion.date} className={'date'} />
								</div>

								<div className={'pt-button-group pt-minimal pt-small'}>
									<button type={'button'} className={'pt-button pt-icon-edit2'} />
									<button type={'button'} className={'pt-button pt-icon-more'} />
								</div>
							</div>

							<div className={'text'}>{discussion.text}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

DiscussionThread.propTypes = propTypes;
export default DiscussionThread;
