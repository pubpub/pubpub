import React, {PropTypes} from 'react';
import RadioGroup from 'react-radio-group';
import Radium from 'radium';

let styles = {};

const RadioButtonProp = React.createClass({
	propTypes: {
		choices: PropTypes.array,
		selectedValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	},
	getInitialState: function() {
		const state = {};

		if (this.props.selectedValue && !isNaN(this.props.selectedValue)) {
			state.selectedValue = 'number';
			state.number = parseInt(this.props.selectedValue, 10);
		} else {
			state.selectedValue = this.props.selectedValue || null;
			state.number = null;
		}

		return state;
	},

	focusNumber: function() {
		this.setState({
			selectedValue: 'number'
		});
	},
	handleNumber: function(event) {
		let val = event.target.value;
		if (String(val).length > 3) {
			val = parseInt(String(1524).substring(0, 3), 10);
		}
		this.setState({
			selectedValue: 'number',
			number: val
		});
	},
	handleChange: function(prop) {
		this.setState({
			selectedValue: prop
		});
	},
	value: function() {
		return (this.state.selectedValue === 'number') ? this.state.number : this.state.selectedValue;
	},
	render: function() {
		const choices = this.props.choices || [];
		const self = this;
		return (
			<div style={styles.group}>
				<RadioGroup
					ref="radio"
					selectedValue={this.state.selectedValue}
					onChange={this.handleChange}>
					{Radio => (
						<div>
							{choices.map(function(choice) {
								let elem;
								if (choice !== 'number') {
									elem = (<label key={choice} style={{width: '75px', display: 'inline-block', fontSize: '0.9em' }}>
										<Radio value={choice} />{choice}
										</label>);
								} else {
									elem = (<label key={choice} style={{width: '60px', display: 'inline-block'}}>
										<Radio value={choice} />
										<input value={self.state.number} onClick={self.focusNumber} onChange={self.handleNumber} style={styles.input} min="1" max="100" maxLength="2" type="number"/>%
										</label>);
								}
								return elem;
							})}
						</div>
					)}
				</RadioGroup>
			</div>
		);
	}
});

styles = {
	input: {
		width: '30px',
		fontSize: '0.7em',
		borderTop: 'none',
		borderLeft: 'none',
		borderRight: 'none',
		borderBottom: 'gainsboro solid 1px',
	}
};

export default Radium(RadioButtonProp);
