import React, {PropTypes} from 'react';
import RadioGroup from 'react-radio-group';
import Radium from 'radium';

let styles = {};

const RadioButtonProp = React.createClass({
	propTypes: {
		choices: PropTypes.array,
		selectedValue: PropTypes.string,
	},
	getInitialState: function() {
		return {
			selectedValue: this.props.selectedValue || null,
		};
	},

	handleChange: function(prop) {
		const selectedVal = prop;
		let val = prop;

		if (prop === 'number') {
			val = this.refs.radio.refs.number.value;
		}
		console.log(val);
		this.setState({
			selectedValue: selectedVal,
			value: val
		});
	},
	value: function() {
		return this.state.value;
	},
	render: function() {
		const choices = this.props.choices || [];
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
									elem = (<label style={{width: '75px', display: 'inline-block', fontSize: '0.9em' }}>
										<Radio ref={choice} value={choice} />{choice}
										</label>);
								} else {
									elem = (<label style={{width: '60px', display: 'inline-block'}}>
										<Radio value={choice} />
										<input ref={choice} style={{width: '26px', fontSize: '0.7em'}} min="1" max="100" maxLength="3" type="number"/>%
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
	group: {
	}
};

export default Radium(RadioButtonProp);
