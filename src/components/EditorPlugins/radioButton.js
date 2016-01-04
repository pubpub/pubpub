import React, {PropTypes} from 'react';
import RadioGroup from 'react-radio-group';

export default React.createClass({

  getInitialState: function() {
    return {
      selectedValue: this.props.choices[0] || null,
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
                return (<label>
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
