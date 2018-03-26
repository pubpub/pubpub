import React from 'react';
import PropTypes from 'prop-types';

require('./pubPresChapters.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	mode: PropTypes.string,
};

const defaultProps = {
	mode: undefined,
};

const PubPresChapters = (props)=> {
	return (
		<div className="pub-pres-chapters-component">
			{!props.mode &&
				<h5>Chapters</h5>
			}

		</div>
	);
};

PubPresChapters.propTypes = propTypes;
PubPresChapters.defaultProps = defaultProps;
export default PubPresChapters;
