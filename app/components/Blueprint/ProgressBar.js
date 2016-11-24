/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let ProgressBarComponent;
export const ProgressBar = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		ProgressBarComponent = require('@blueprintjs/core').ProgressBar;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <ProgressBarComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default ProgressBar;
