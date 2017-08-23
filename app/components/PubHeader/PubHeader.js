import React from 'react';
import PropTypes from 'prop-types';

require('./pubHeader.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	backgroundImage: PropTypes.string,
};

const defaultProps = {
	description: undefined,
	backgroundImage: undefined,
};

const PubHeader = function(props) {
	const backgroundStyle = {};
	if (props.backgroundImage) {
		backgroundStyle.backgroundImage = `url("${props.backgroundImage}")`;
		backgroundStyle.color = 'white';
	}

	return (
		<div className={'pub-header'} style={backgroundStyle}>
			<div className={`wrapper ${props.backgroundImage ? 'dim' : ''}`}>
				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>{props.title}</h1>
							{props.description &&
								<div className={'description'}>{props.description}</div>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubHeader.defaultProps = defaultProps;
PubHeader.propTypes = propTypes;
export default PubHeader;
