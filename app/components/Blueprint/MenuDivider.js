/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let MenuDividerComponent;
export const MenuDivider = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		MenuDividerComponent = require('@blueprintjs/core').MenuDivider;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <MenuDividerComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default MenuDivider;
