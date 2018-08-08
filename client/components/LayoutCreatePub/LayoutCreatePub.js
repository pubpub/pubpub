import React from 'react';
import PropTypes from 'prop-types';

require('./layoutCreatePub.scss');

const propTypes = {
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* text, align, size, defaultTags */
};

const LayoutCreatePub = function(props) {
	const wrapperStyle = {
		float: props.content.align !== 'center'
			? props.content.align
			: 'none',
		textAlign: 'center',
	};

	const button = (
		<button
			type="button"
			className={`pt-button ${props.content.size === 'large' ? 'pt-large' : ''}`}
			onClick={()=> {
				console.log('Yooo');
			}}
		>
			{props.content.text || 'Create Pub'}
		</button>
	);
	return (
		<div className="layout-create-pub-component" style={wrapperStyle}>
			<div className="block-content">
				{props.content.align !== 'center' && button}

				{props.content.align === 'center' &&
					<div className="container">
						<div className="row">
							<div className="col-12">
								{button}
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	);
};

LayoutCreatePub.propTypes = propTypes;
export default LayoutCreatePub;
