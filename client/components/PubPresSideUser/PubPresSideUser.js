import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { getResizedUrl } from 'utilities';

require('./pubPresSideUser.scss');

const propTypes = {
	user: PropTypes.object.isRequired,
};

const PubPresSideUser = function(props) {
	return (
		<div className="pub-pres-side-user-component">
			<div className="avatar-wrapper">
				<a href={`/user/${props.user.slug}`}>
					<Avatar
						userInitials={props.user.initials}
						userAvatar={props.user.avatar}
						width={40}
					/>
				</a>
			</div>
			<div className="details-wrapper">
				<div className="name">
					<a href={`/user/${props.user.slug}`}>{props.user.fullName}</a>
				</div>
				<div>{props.user.title}</div>
			</div>
			
		</div>
	);
};

PubPresSideUser.propTypes = propTypes;
export default PubPresSideUser;
