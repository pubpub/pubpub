/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let MenuItemComponent;
export const MenuItem = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		MenuItemComponent = require('@blueprintjs/core').MenuItem;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <MenuItemComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default MenuItem;
