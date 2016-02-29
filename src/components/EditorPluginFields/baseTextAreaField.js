import React, {PropTypes} from 'react';
import Radium from 'radium';
import AutoTextarea from 'react-textarea-autosize';

let styles = {};

const TextAreaProp = React.createClass({
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
		this.props.saveChange();
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
		return <AutoTextarea ref={(ref) => this.textInput = ref} placeholder={this.props.placeholder} style={styles.select} type="text" value={value} onChange={this.handleChange}/>;
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
		height: '2.5em',
		paddingLeft: '5px',
		resize: 'vertical',
		lineHeight: '1.58',
		outline: 'none',
		backgroundColor: 'whitesmoke',
	},
};

export default Radium(TextAreaProp);
