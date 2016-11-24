/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let SpinnerComponent;
export const Spinner = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		SpinnerComponent = require('@blueprintjs/core').Spinner;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <SpinnerComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Spinner;
