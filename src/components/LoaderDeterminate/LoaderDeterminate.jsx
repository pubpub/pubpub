import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const initStyle = {
	transform: 'translateX(-100%)',
	width: '100%',
	height: '4px',
	backgroundColor: '#363736',
	transition: '.2s ease-out transform',
};

const animateOff = {
	transition: '.0s linear transform',
};

export const LoaderDeterminate = React.createClass({
	propTypes: {
		value: PropTypes.number // 0-100
	},

	getInitialState() {
		return {
			animate: true,
		};
	},

	componentWillReceiveProps(nextProps) {
		// Don't animate backwards
		if (nextProps.value < this.props.value) {
			this.setState({animate: false});
		} else {
			this.setState({animate: true});
		}
	},

	render: function() {
		const percentage = this.props.value;

		return (
			<div className="loading-bar" style={[initStyle, isNaN(percentage) === false && styles(percentage), !this.state.animate && animateOff]}>

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
