import React from 'react';
import PropTypes from 'prop-types';
import { getResizedUrl } from 'utilities';

require('./pubPresHeader.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	backgroundImage: PropTypes.string,
};

const defaultProps = {
	description: undefined,
	backgroundImage: undefined,
};

const PubPresHeader = function(props) {
	const backgroundStyle = {};
	if (props.backgroundImage) {
		const resizedBackground = getResizedUrl(props.backgroundImage, 'fit-in', '1500x600');
		backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
		backgroundStyle.color = 'white';
	}

	return (
		<div className={'pub-pres-header'} style={backgroundStyle}>
			<div className={`wrapper ${props.backgroundImage ? 'dim' : ''}`}>
				<div className={'container pub'}>
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

PubPresHeader.defaultProps = defaultProps;
PubPresHeader.propTypes = propTypes;
export default PubPresHeader;
