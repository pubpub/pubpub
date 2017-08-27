import React from 'react';
// import PropTypes from 'prop-types';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';

// require('./pubCollabShare.scss');

// const propTypes = {
// 	title: PropTypes.string.isRequired,
// 	icon: PropTypes.string,
// 	description: PropTypes.string,
// 	hideBottomBorder: PropTypes.bool,
// };

const PubCollabShare = function(props) {
	return (
		<div className={'pub-collab-share'}>
			<h5>Share</h5>

			<PubCollabDropdownPrivacy />
			<PubCollabDropdownPermissions />
		</div>
	);
};

// PubCollabShare.propTypes = propTypes;
export default PubCollabShare;
