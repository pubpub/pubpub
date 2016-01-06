import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const TextProp = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string,
	},
	getInitialState: function() {
		return {
			value: this.props.selectedValue || null,
		};
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
	},
	value: function() {
		return this.state.value;
	},
	render: function() {
		const value = this.state.value || '';
		return <input placeholder="Enter Caption" style={styles.select} type="text" value={value} onChange={this.handleChange} />;
	}
});

styles = {
	select: {
		width: '100%',
		fontFamily: 'courier',
		borderTop: 'none',
		borderLeft: 'none',
		borderRight: 'none',
		borderBottom: 'gainsboro solid 1px',
		fontSize: '15px',
		height: '2em',
		paddingLeft: '5px',
	},
};

export default Radium(TextProp);
