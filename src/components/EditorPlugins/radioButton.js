import React, {PropTypes} from 'react';
import RadioGroup from 'react-radio-group';

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
			<div>
				<RadioGroup
					selectedValue={this.state.selectedValue}
					onChange={this.handleChange}>
					{Radio => (
						<div>
							{choices.map(function(choice) {
								return (<label style={{paddingRight: '10px'}}>
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

export default RadioButtonProp;
