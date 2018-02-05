import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';

require('./pubPresSideUser.scss');

const propTypes = {
	user: PropTypes.object.isRequired,
};

const PubPresSideUser = function(props) {
	const avatarElement = props.user.slug
		? (
			<a href={`/user/${props.user.slug}`}>
				<Avatar
					userInitials={props.user.initials}
					userAvatar={props.user.avatar}
					width={40}
				/>
			</a>
		)
		: (
			<Avatar
				userInitials={props.user.initials}
				userAvatar={props.user.avatar}
				width={40}
			/>
		);

	const nameElement = props.user.slug
		? <a href={`/user/${props.user.slug}`}>{props.user.fullName}</a>
		: <span>{props.user.fullName}</span>;

	return (
		<div className="pub-pres-side-user-component">
			<div className="avatar-wrapper">
				{avatarElement}
			</div>
			<div className="details-wrapper">
				<div className="name">
					{nameElement}
				</div>
				<div>{props.user.title}</div>
			</div>
		</div>
	);
};

PubPresSideUser.propTypes = propTypes;
export default PubPresSideUser;
