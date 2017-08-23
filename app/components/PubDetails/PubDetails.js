import React from 'react';
import PropTypes from 'prop-types';

require('./pubDetails.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	backgroundImage: PropTypes.string,
};

const defaultProps = {
	description: undefined,
	backgroundImage: undefined,
};

const PubDetails = function(props) {
	const backgroundStyle = {};
	if (props.backgroundImage) {
		backgroundStyle.backgroundImage = `url("${props.backgroundImage}")`;
		backgroundStyle.color = 'white';
	}

	return (
		<div className={'pub-header'} style={backgroundStyle}>
			<div className={props.backgroundImage ? 'background dim' : 'background'}>
				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>{props.title}</h1>
							<div className={'description'}>{props.description}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubDetails.defaultProps = defaultProps;
PubDetails.propTypes = propTypes;
export default PubDetails;
