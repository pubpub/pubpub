/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let MenuComponent;
export const Menu = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		MenuComponent = require('@blueprintjs/core').Menu;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <MenuComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Menu;
