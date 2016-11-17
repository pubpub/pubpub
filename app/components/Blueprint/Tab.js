/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TabComponent;
export const Tab = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TabComponent = require('@blueprintjs/core').Tab;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TabComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Tab;
