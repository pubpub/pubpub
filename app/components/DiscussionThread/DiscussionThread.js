import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import DropdownButton from 'components/DropdownButton/DropdownButton';

require('./discussionThread.scss');

const propTypes = {
	discussions: PropTypes.array.isRequired,
	slug: PropTypes.string.isRequired,
};

const DiscussionThread = function(props) {
	const sortedDiscussions = props.discussions.sort((foo, bar)=> {
		if (foo.date > bar.date) { return 1; }
		if (foo.date < bar.date) { return -1; }
		return 0;
	});

	return (
		<div className={'discussion-thread'}>
			<Link to={`/pub/${props.slug}/collaborate`} className={'back pt-button pt-minimal'}>
				Show all threads
			</Link>

			<div className={'thread-buttons pt-button-group pt-minimal pt-small'}>
				<button type={'button'} className={'pt-button pt-icon-edit2'} />
				<button type={'button'} className={'pt-button pt-icon-compressed'} />
			</div>


			<div className={'title'}>{sortedDiscussions[0].title}</div>
			<div>
				{sortedDiscussions.map((discussion)=> {
					return (
						<div className={'discussion'} key={`discussion-${discussion.id}`}>

							<div className={'item-header'}>
								<Link to={`/user/${discussion.author.slug}`}>
									<Avatar
										width={30}
										userInitials={discussion.author.userInitials}
										userAvatar={discussion.author.userAvatar}
									/>
								</Link>

								<div className={'details'}>
									<div className={'name'}>
										<Link to={`/user/${discussion.author.slug}`}>{discussion.author.fullName || discussion.author.userInitials}</Link>
									</div>
									<TimeAgo date={discussion.date} className={'date'} />
								</div>

								<div className={'pt-button-group pt-minimal pt-small'}>
									<button type={'button'} className={'pt-button pt-icon-edit2'} />
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

			<input
				className="pt-input"
				placeholder={'Reply...'}
			/>
		</div>
	);
};

DiscussionThread.propTypes = propTypes;
export default DiscussionThread;
