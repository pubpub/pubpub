/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let RadioGroupComponent;
export const RadioGroup = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		RadioGroupComponent = require('@blueprintjs/core').RadioGroup;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <RadioGroupComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default RadioGroup;
