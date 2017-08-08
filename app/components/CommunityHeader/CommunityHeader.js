import React from 'react';
import PropTypes from 'prop-types';

require('./communityHeader.scss');

const propTypes = {
	logo: PropTypes.string.isRequired,
	description: PropTypes.string,
	backgroundImage: PropTypes.string,
};

const CommunityHeader = function(props) {
	const backgroundStyle = {};
	if (props.backgroundImage) {
		backgroundStyle.backgroundImage = `url("${props.backgroundImage}")`;
	}
	return (
		<div style={backgroundStyle} className={`community-header ${props.backgroundImage ? 'has-image' : 'accent-background accent-color'}`}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<img alt={'community logo'} className={'logo'} src={props.logo} />
						<div className={'description'}>{props.description}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

CommunityHeader.propTypes = propTypes;
export default CommunityHeader;
