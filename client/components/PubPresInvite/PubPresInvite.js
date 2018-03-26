import React from 'react';
import PropTypes from 'prop-types';

require('./pubPresInvite.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	mode: PropTypes.string,
};

const defaultProps = {
	mode: undefined,
};

const PubPresInvite = function(props) {
	const pubData = props.pubData;
	return (
		<div className="pub-pres-invite-component">
			{!props.mode &&
				<h5>Invite Reviewer</h5>
			}
			<div className="intro">How about an invitation?</div>
		</div>
	);
};

PubPresInvite.defaultProps = defaultProps;
PubPresInvite.propTypes = propTypes;
export default PubPresInvite;
