import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getResizedUrl } from 'utils/images';
import { usePageContext } from 'utils/hooks';

require('./avatar.scss');

const propTypes = {
	width: PropTypes.number.isRequired, // Integer number of pixels for avatar
	initials: PropTypes.string,
	avatar: PropTypes.string,
	instanceNumber: PropTypes.number,
	borderColor: PropTypes.string,
	borderWidth: PropTypes.string,
	doesOverlap: PropTypes.bool, // Boolean on whether a lisst of avatars will be overlapping
	isBlock: PropTypes.bool,
	className: PropTypes.string,
};

const defaultProps = {
	initials: '?',
	avatar: undefined,
	instanceNumber: undefined,
	borderColor: undefined,
	borderWidth: undefined,
	doesOverlap: false,
	isBlock: false,
	className: '',
};

const Avatar = function(props) {
	const {
		initials,
		avatar,
		instanceNumber,
		borderColor,
		borderWidth,
		width,
		doesOverlap,
		isBlock,
		className,
	} = props;
	const { communityData } = usePageContext();

	const avatarStyle = {
		width,
		minWidth: width,
		height: width,
		borderColor,
		borderWidth: borderColor ? borderWidth || Math.floor(width / 50) + 1 : 0,
		fontSize: isBlock ? Math.floor(width / 1.5) : Math.floor(width / 2.5),
		backgroundColor: communityData.accentColorDark,
		zIndex: instanceNumber ? -1 * instanceNumber : 'initial',
		borderRadius: isBlock ? '2px' : '50%',
	};

	const imageSize = width <= 50 ? '50x50' : '250x250';
	const resizedImageUrl = getResizedUrl(avatar, null, imageSize);

	if (doesOverlap) {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'marginRight' does not exist on type '{ w... Remove this comment to see the full error message
		avatarStyle.marginRight = `${width * 0.45 * -1}px`;
	}
	if (avatar) {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundImage' does not exist on type ... Remove this comment to see the full error message
		avatarStyle.backgroundImage = `url("${resizedImageUrl}")`;
	}

	return (
		// @ts-expect-error ts-migrate(2322) FIXME: Type '{ width: any; minWidth: any; height: any; bo... Remove this comment to see the full error message
		<div className={classNames(['avatar-component', className])} style={avatarStyle}>
			{!avatar && <div>{initials}</div>}
		</div>
	);
};

Avatar.defaultProps = defaultProps;
Avatar.propTypes = propTypes;
export default Avatar;
