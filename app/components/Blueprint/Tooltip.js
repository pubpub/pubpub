/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TooltipComponent;
export const Tooltip = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TooltipComponent = require('@blueprintjs/core').Tooltip;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TooltipComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Tooltip;
