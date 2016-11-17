/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TabPanelComponent;
export const TabPanel = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TabPanelComponent = require('@blueprintjs/core').TabPanel;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TabPanelComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default TabPanel;
