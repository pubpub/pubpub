import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

require('./lengthIndicator.scss');

const propTypes = {
	length: PropTypes.number.isRequired,
	maxLength: PropTypes.number.isRequired,
	visibilityThreshold: PropTypes.number,
};

const defaultProps = {
	visibilityThreshold: 0.9,
};

function LengthIndicator(props) {
	const { length, maxLength, visibilityThreshold } = props;
	const lengthRatio = length / maxLength;
	const showLengthIndicator = lengthRatio > visibilityThreshold;

	if (!showLengthIndicator) {
		return null;
	}

	return (
		<span
			className={classnames(
				'length-indicator-component',
				lengthRatio === 1 && 'at-max-length',
			)}
		>
			{length} / {maxLength}
		</span>
	);
}

LengthIndicator.propTypes = propTypes;
LengthIndicator.defaultProps = defaultProps;
export default LengthIndicator;
