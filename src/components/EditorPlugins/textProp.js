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
		return <input style={styles.select} type="text" value={value} onChange={this.handleChange} />;
	}
});

styles = {
	select: {
		width: '75%',
	},
};

export default Radium(TextProp);
