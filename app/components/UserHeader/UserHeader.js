import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';

require('./userHeader.scss');

const propTypes = {
	userData: PropTypes.object.isRequired,
	isUser: PropTypes.bool,
};

const defaultProps = {
	isUser: false,
};

const UserHeader = function(props) {
	const links = [
		{ id: 0, value: props.userData.location, icon: 'pt-icon-map-marker no-click' },
		{ id: 1, value: props.userData.website, icon: 'pt-icon-link', href: props.userData.website },
		{ id: 2, value: props.userData.facebook, icon: 'pt-icon-facebook', href: `https://www.facebook.com/${props.userData.facebook}` },
		{ id: 3, value: props.userData.twitter, icon: 'pt-icon-twitter', href: `https://www.twitter.com/${props.userData.twitter}` },
		{ id: 4, value: props.userData.orcid, icon: 'pt-icon-orcid', href: `https://www.orcid.org/${props.userData.orcid}` },
		{ id: 5, value: props.userData.googleScholar, icon: 'pt-icon-google-scholar', href: `https://scholar.google.com/${props.userData.googleScholar}` },

	];
	return (
		<div className={'user-header'}>
			<div className={'avatar-wrapper'}>
				<Avatar
					userAvatar={props.userData.avatar}
					userInitials={props.userData.initials}
					width={150}
				/>
				{props.isUser &&
					<div>
						<Link to={`/user/${props.userData.slug}/edit`} className={'pt-button pt-intent-primary'}>Edit Profile</Link>
					</div>
				}
			</div>
			<div className={'details'}>
				<h1>{props.userData.fullName}</h1>
				<div className={'bio'}>{props.userData.bio}</div>

				<div className={'links'}>
					{links.filter((link)=> {
						return link.value;
					}).map((link)=> {
						return <a key={`link-${link.id}`} className={`pt-button pt-minimal ${link.icon}`} href={link.href} rel={'noopener noreferrer'}>{link.value}</a>;
					})}
				</div>
			</div>
		</div>
	);
};

UserHeader.defaultProps = defaultProps;
UserHeader.propTypes = propTypes;
export default UserHeader;
