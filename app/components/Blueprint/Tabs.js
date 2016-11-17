/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TabsComponent;
export const Tabs = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TabsComponent = require('@blueprintjs/core').Tabs;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TabsComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Tabs;
