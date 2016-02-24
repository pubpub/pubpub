import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const TextAreaProp = React.createClass({
	propTypes: {
		selectedValue: PropTypes.string,
		placeholder: PropTypes.string
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
		return (value) ? '"' + value.replace(/\n|\r/g, ' ') + '"' : null; // text captions have to be wrapped in quotes
	},
	render: function() {
		const value = this.state.value || '';
		return <textarea ref={(ref) => this.textInput = ref} placeholder={this.props.placeholder} style={styles.select} type="text" value={value} onChange={this.handleChange}></textarea>;
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
		height: '2.5em',
		paddingLeft: '5px',
		resize: 'vertical',
	},
};

export default Radium(TextAreaProp);
