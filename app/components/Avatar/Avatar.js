import React from 'react';
import PropTypes from 'prop-types';

require('./avatar.scss');

const propTypes = {
	userInitials: PropTypes.string,
	userAvatar: PropTypes.string,

	borderColor: PropTypes.string,
	borderWidth: PropTypes.string,
	width: PropTypes.number.isRequired, // Integer number of pixels for avatar
	doesOverlap: PropTypes.bool, // Boolean on whether a lisst of avatars will be overlapping
};

const defaultProps = {
	userAvatar: undefined,
	userInitials: '?',
	borderColor: undefined,
	borderWidth: undefined,
	doesOverlap: false,
};

const Avatar = function(props) {
	const avatarStyle = {
		width: props.width,
		height: props.width,
		borderColor: props.borderColor,
		borderWidth: props.borderColor ? (props.borderWidth || Math.floor(props.width / 50) + 1) : 0,
		fontSize: Math.floor(props.width / 2.5),
	};

	if (props.doesOverlap) {
		avatarStyle.marginRight = `${props.width * 0.45 * -1}px`;
	}
	if (props.userAvatar) {
		avatarStyle.backgroundImage = `url("${props.userAvatar}")`;
	}

	return (
		<div className={'avatar'} style={avatarStyle}>
			{!props.userAvatar &&
				<div>{props.userInitials}</div>
			}
		</div>
	);
};

Avatar.defaultProps = defaultProps;
Avatar.propTypes = propTypes;
export default Avatar;
