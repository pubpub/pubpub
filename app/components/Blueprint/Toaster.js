/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let ToasterComponent;
export const Toaster = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		ToasterComponent = require('@blueprintjs/core').Toaster;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <ToasterComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Toaster;
