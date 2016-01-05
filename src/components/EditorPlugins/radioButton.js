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

	handleChange: function(value) {
		this.setState({
			selectedValue: value,
		});
	},
	value: function() {
		return this.state.selectedValue;
	},
	render: function() {
		const choices = this.props.choices || [];
		return (
			<div style={styles.group}>
				<RadioGroup
					selectedValue={this.state.selectedValue}
					onChange={this.handleChange}>
					{Radio => (
						<div>
							{choices.map(function(choice) {
								return (<label style={{width: '86px', display: 'inline-block'}}>
									<Radio value={choice} />{choice}
									</label>);
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
