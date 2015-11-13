import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};
const initStyle = {
	transform: 'translateX(-100%)',
	width: '100%',
	height: '1px',
	backgroundColor: '#999999',
	transition: '.2s linear transform',
};

const LoaderDeterminate = React.createClass({
	propTypes: {
		value: PropTypes.number // 0-100
	},

	render: function() {
		const percentage = this.props.value;

		return (
			<div className="loading-bar" style={[initStyle, isNaN(percentage) === false && styles(percentage)]}>
				
			</div>
		);
	}
});


styles = function(percentage) {
	return {
		transform: 'translateX(' + (-100 + percentage) + '%)',
	};
};

export default Radium(LoaderDeterminate);
