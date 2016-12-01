/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let RadioComponent;
export const Radio = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		RadioComponent = require('@blueprintjs/core').Radio;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <RadioComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Radio;
