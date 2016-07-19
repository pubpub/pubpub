import React, {PropTypes} from 'react';

export const Radio = React.createClass({
  displayName: 'Radio',

  contextTypes: {
    radioGroup: React.PropTypes.object
  },

  render: function() {
    const {name, selectedValue, onChange} = this.context.radioGroup;
    const optional = {};
    if(selectedValue !== undefined) {
      optional.checked = (this.props.value === selectedValue);
    }
    if(typeof onChange === 'function') {
      optional.onChange = onChange.bind(null, this.props.value);
    }

    return (
      <input
        {...this.props}
        type="radio"
        name={name}
        {...optional} />
    );
  }
});

export const RadioGroup = React.createClass({
  displayName: 'RadioGroup',

  propTypes: {
    name: PropTypes.string,
    selectedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired,
    Component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ])
  },

  getDefaultProps: function() {
    return {
      Component: "div"
    };
  },

  childContextTypes: {
    radioGroup: React.PropTypes.object
  },

  getChildContext: function() {
    const {name, selectedValue, onChange} = this.props;
    return {
      radioGroup: {
        name, selectedValue, onChange
      }
    }
  },

  render: function() {
    const {Component, name, selectedValue, onChange, children, ...rest} = this.props;
    return <Component {...rest}>{children}</Component>;
  }
});