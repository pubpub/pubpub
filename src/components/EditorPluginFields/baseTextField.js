import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const TextProp = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string,
		placeholder: PropTypes.string,
		saveChange: PropTypes.func,
	},
	getInitialState: function() {
		return {
			value: this.props.selectedValue || null,
		};
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
	},
	focus: function() {
		let focused;
		if (this.state.value && this.state.value.length > 2) {
			focused = false;
		} else {
			this.textInput.focus();
			focused = true;
		}
		return focused;
	},
	value: function() {
		const value = this.state.value;
		return (value) ? '"' + value + '"' : null; // text captions have to be wrapped in quotes
	},
	render: function() {
		const value = this.state.value || '';
		return <input ref={(ref) => this.textInput = ref} placeholder={this.props.placeholder} style={styles.select} type="text" value={value} onChange={this.handleChange} />;
	}
});

styles = {
	select: {
		width: '100%',
		fontFamily: 'Courier',
		borderTop: 'none',
		borderLeft: 'none',
		borderRight: 'none',
		borderBottom: 'gainsboro solid 1px',
		fontSize: '15px',
		height: '2em',
		paddingLeft: '5px',
		outline: 'none',
		backgroundColor: 'whitesmoke',
	},
};

export default Radium(TextProp);
