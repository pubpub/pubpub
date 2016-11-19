/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let NonIdealStateComponent;
export const NonIdealState = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		NonIdealStateComponent = require('@blueprintjs/core').NonIdealState;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <NonIdealStateComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default NonIdealState;
