import React from 'react';
import PropTypes from 'prop-types';

require('./layoutHeader.scss');

const propTypes = {
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* text, align, background, backgroundSize */
};

const LayoutHeader = function(props) {
	const textStyle = {
		textAlign: props.content.align || 'left',
		color: 'white',
		fontSize: '40px',
		lineHeight: '1em',
	};
	const backgroundStyle = {
		background: '#03a9f4',
		minHeight: '200px',
		display: 'flex',
		alignItems: 'center',
	};
	return (
		<div className="layout-header-component">
			<div className="block-content" style={props.content.backgroundSize === 'full' ? backgroundStyle : undefined}>
				<div className="container">
					<div className="row" style={props.content.backgroundSize === 'standard' ? backgroundStyle : undefined}>
						<div className="col-12">
							<h2 style={textStyle}>
								{props.content.text}
							</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LayoutHeader.propTypes = propTypes;
export default LayoutHeader;
